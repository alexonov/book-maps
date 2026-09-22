"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CharacterFilters } from "@/components/book-map/character-filters";
import { Inspector } from "@/components/book-map/inspector";
import { MapLegend } from "@/components/book-map/legend";
import { BookMapView, MapEmptyState } from "@/components/book-map/map-view";
import { ProgressControl } from "@/components/book-map/progress-control";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { catalog } from "@/data";
import {
  beatAfterSteps,
  beatById,
  beatOrder,
  lastBeatForChapter,
  remainingSteps,
  visitBeatId,
} from "@/lib/beats";
import {
  getProgress,
  getServerProgress,
  saveProgress,
  subscribeProgress,
  type ProgressState,
} from "@/lib/progress";
import {
  visibleCharacters,
  visibleJourneys,
  visibleLocations,
} from "@/lib/spoiler";
import { PanelRight } from "lucide-react";

const DEFAULT_BEAT = catalog.beats[0]?.id ?? "dawn-santa-anna";

export function AppShell() {
  const stored = useSyncExternalStore(
    subscribeProgress,
    () => getProgress(catalog.beats, catalog.chapters, DEFAULT_BEAT),
    () => getServerProgress(DEFAULT_BEAT),
  );

  const { progressId, furthestId } = stored;
  const currentBeat = beatById(catalog.beats, progressId) ?? catalog.beats[0];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hereId, setHereId] = useState<string | null>(null);
  const [walkBack, setWalkBack] = useState(false);
  const [undoState, setUndoState] = useState<ProgressState | null>(null);
  const [characterIds, setCharacterIds] = useState<string[]>([]);
  const [showBackground, setShowBackground] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const sync = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMobileOpen(false);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const people = useMemo(
    () => visibleCharacters(catalog.beats, catalog.characters, progressId),
    [progressId],
  );

  const activeCharacterIds = useMemo(
    () =>
      characterIds.filter((id) => people.some((person) => person.id === id)),
    [characterIds, people],
  );

  const places = useMemo(
    () =>
      visibleLocations(catalog.beats, catalog.locations, progressId, {
        showBackground,
        characterIds: activeCharacterIds,
      }),
    [activeCharacterIds, progressId, showBackground],
  );

  const routes = useMemo(
    () =>
      visibleJourneys(catalog.beats, catalog.journeys, progressId, {
        showRoutes,
        characterIds: activeCharacterIds,
      }),
    [activeCharacterIds, progressId, showRoutes],
  );

  const selected = places.find((place) => place.id === selectedId) ?? null;
  const focusLocationId = hereId ?? currentBeat?.currentLocationId ?? null;
  const filterActive = activeCharacterIds.length > 0;
  const canAdvance = remainingSteps(catalog.beats, furthestId) > 0;
  const noteProgressId = walkBack && selected
    ? visitBeatId(selected, catalog.beats, progressId)
    : progressId;

  function commit(
    next: ProgressState,
    recordUndo: boolean,
    nextWalkBack = false,
  ) {
    if (recordUndo) setUndoState({ progressId, furthestId });
    else setUndoState(null);
    setHereId(null);
    setSelectedId(null);
    setWalkBack(nextWalkBack);
    saveProgress(next);
  }

  function handleAdvance(steps = 1) {
    const next = beatAfterSteps(catalog.beats, furthestId, steps);
    if (!next || next.id === furthestId) return;
    commit({ progressId: next.id, furthestId: next.id }, true);
  }

  function handleSelectBeat(beatId: string) {
    const beat = beatById(catalog.beats, beatId);
    if (!beat) return;
    commit({ progressId: beat.id, furthestId }, false, beat.id !== furthestId);
  }

  function handleSelectChapter(chapterId: string) {
    const beat = lastBeatForChapter(catalog.beats, chapterId);
    if (!beat) return;
    const nextFurthest =
      beatOrder(catalog.beats, beat.id) > beatOrder(catalog.beats, furthestId)
        ? beat.id
        : furthestId;
    commit(
      { progressId: beat.id, furthestId: nextFurthest },
      true,
      beat.id !== nextFurthest,
    );
  }

  function handleReset() {
    commit({ progressId: DEFAULT_BEAT, furthestId: DEFAULT_BEAT }, false);
  }

  function handleReturnLatest() {
    commit({ progressId: furthestId, furthestId }, false);
  }

  function handleUndo() {
    if (!undoState) return;
    const previous = undoState;
    setUndoState(null);
    setHereId(null);
    setSelectedId(null);
    setWalkBack(false);
    saveProgress(previous);
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    setProgressOpen(false);
    if (isMobile) setMobileOpen(true);
  }

  function handleProgressOpen(open: boolean) {
    setProgressOpen(open);
    if (open) setMobileOpen(false);
  }

  const inspector = (
    <Inspector
      location={selected}
      beats={catalog.beats}
      chapters={catalog.chapters}
      characters={people}
      noteProgressId={noteProgressId}
      currentSynopsis={currentBeat?.synopsis ?? ""}
      visibleCount={places.length}
      isCurrent={selected?.id === focusLocationId && !walkBack}
      walkBack={walkBack}
      onClear={() => setSelectedId(null)}
      onMarkHere={(id) => {
        setHereId(id);
        setWalkBack(false);
      }}
    />
  );

  return (
    <div className="flex min-h-dvh flex-col bg-[#120e0b] text-[#f0e6d4]">
      <header className="relative z-40 border-b border-[#c4a574]/20 bg-[#120e0b]/95 px-3 py-2 backdrop-blur-md md:px-6 md:py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-cinzel)] text-[0.62rem] tracking-[0.34em] text-[#c4a574] md:text-[0.68rem]">
              Book Maps
            </p>
            <h1 className="font-serif text-xl leading-tight text-[#f0e6d4] md:text-3xl">
              The Shadow of the Wind
            </h1>
            <p className="mt-0.5 text-xs text-[#c4b49a] sm:text-sm">
              Mapped by Alexander Kononov
              <span className="hidden sm:inline">
                {" · "}Later streets stay off the map.
              </span>
            </p>
          </div>
          <ProgressControl
            beats={catalog.beats}
            chapters={catalog.chapters}
            progressId={progressId}
            furthestId={furthestId}
            walkBack={walkBack}
            canUndo={Boolean(undoState)}
            canAdvance={canAdvance}
            sheetOpen={progressOpen}
            onSheetOpenChange={handleProgressOpen}
            onWalkBackChange={setWalkBack}
            onAdvance={() => handleAdvance(1)}
            onCatchUp={handleAdvance}
            onUndo={handleUndo}
            onSelectBeat={handleSelectBeat}
            onSelectChapter={handleSelectChapter}
            onReturnLatest={handleReturnLatest}
            onReset={handleReset}
          />
        </div>
      </header>

      <div className="relative z-0 flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="relative isolate z-0 min-h-[72vh] flex-1 overflow-hidden lg:min-h-0">
          <div className="absolute inset-0 z-0 isolate">
            <BookMapView
              locations={places}
              journeys={routes}
              selectedId={selected?.id ?? null}
              focusLocationId={focusLocationId}
              walkBack={walkBack}
              onSelect={handleSelect}
            />
          </div>

          {places.length === 0 ? (
            <MapEmptyState
              title={
                filterActive
                  ? "No places for this person yet"
                  : "No places are known to you yet"
              }
              body={
                filterActive
                  ? "They may only be named, or they may appear on a historical site. Try Background places, or clear the filter."
                  : "Tap I’ve read further when you have turned another page."
              }
            />
          ) : null}

          <div className="absolute top-2 left-2 z-10 max-h-[42vh] max-w-[min(100%-4.5rem,24rem)] overflow-y-auto rounded-lg border border-[#c4a574]/25 bg-[#120e0b]/88 p-2.5 shadow-lg backdrop-blur-sm sm:top-3 sm:left-3 sm:max-h-none sm:p-3">
            <Button
              variant="ghost"
              size="xs"
              className="mb-2 text-[#c4a574] sm:hidden"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              {filtersOpen ? "Hide filters" : "Characters & filters"}
            </Button>
            <div className={filtersOpen ? "block" : "hidden sm:block"}>
              <CharacterFilters
                characters={people}
                selectedIds={activeCharacterIds}
                onToggle={(id) =>
                  setCharacterIds((current) =>
                    current.includes(id)
                      ? current.filter((item) => item !== id)
                      : [...current, id],
                  )
                }
                onClear={() => setCharacterIds([])}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#d7c7a8] sm:mt-3 sm:gap-4">
              <label className="flex items-center gap-2">
                <Switch
                  size="sm"
                  checked={showRoutes}
                  onCheckedChange={setShowRoutes}
                />
                Routes so far
              </label>
              <label className="flex items-center gap-2">
                <Switch
                  size="sm"
                  checked={showBackground}
                  onCheckedChange={setShowBackground}
                />
                Background places
              </label>
            </div>
          </div>

          <div className="absolute right-3 bottom-16 z-10 hidden sm:block lg:bottom-3">
            <MapLegend />
          </div>

          <div className="absolute right-3 bottom-3 z-10 lg:hidden">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setMobileOpen(true);
                setProgressOpen(false);
              }}
            >
              <PanelRight />
              Inspector
            </Button>
          </div>
        </section>

        <aside className="relative z-20 hidden w-[22.5rem] shrink-0 border-l border-[#c4a574]/20 bg-[#1a1410] lg:block">
          {inspector}
        </aside>
      </div>

      {isMobile ? (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="bottom"
            className="z-[2000] h-[min(78dvh,36rem)] border-[#c4a574]/25 bg-[#1a1410] p-0"
          >
            <SheetTitle className="sr-only">Place inspector</SheetTitle>
            {inspector}
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
