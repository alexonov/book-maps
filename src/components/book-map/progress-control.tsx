"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import type { Beat, Chapter } from "@/data/types";
import { beatById, remainingSteps } from "@/lib/beats";

type ProgressControlProps = {
  beats: Beat[];
  chapters: Chapter[];
  progressId: string;
  furthestId: string;
  walkBack: boolean;
  canUndo: boolean;
  canAdvance: boolean;
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  onWalkBackChange: (walkBack: boolean) => void;
  onAdvance: () => void;
  onCatchUp: (steps: number) => void;
  onUndo: () => void;
  onSelectBeat: (beatId: string) => void;
  onSelectChapter: (chapterId: string) => void;
  onReturnLatest: () => void;
  onReset: () => void;
};

const HOLD_MS = 480;

export function ProgressControl({
  beats,
  chapters,
  progressId,
  furthestId,
  walkBack,
  canUndo,
  canAdvance,
  sheetOpen,
  onSheetOpenChange,
  onWalkBackChange,
  onAdvance,
  onCatchUp,
  onUndo,
  onSelectBeat,
  onSelectChapter,
  onReturnLatest,
  onReset,
}: ProgressControlProps) {
  const current = beatById(beats, progressId) ?? beats[0];
  const part =
    chapters.find((chapter) => chapter.id === current?.chapterId)?.part ?? "";
  const behind = furthestId !== progressId;
  const furthest = beatById(beats, furthestId);
  const reached = beats.filter(
    (beat) => furthest != null && beat.order <= furthest.order,
  );
  const showWalkBack = reached.length > 1;

  return (
    <div className="flex min-w-0 flex-col items-stretch gap-2 sm:items-end">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onSheetOpenChange(true)}
          className="progress-chip min-w-0 flex-1 rounded-sm border border-[#c4a574]/40 bg-[#1a1410]/90 px-3 py-1.5 text-left sm:flex-none sm:min-w-[14rem]"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
        >
          <span className="font-[family-name:var(--font-cinzel)] text-[0.58rem] tracking-[0.2em] text-[#c4a574] uppercase">
            {part}
          </span>
          <span className="block truncate font-serif text-base leading-tight text-[#f0e6d4]">
            {current?.placeLabel ?? "Barcelona"}
          </span>
          <span className="block truncate text-[0.72rem] text-[#c4b49a]">
            {current?.moodLabel}
            {current?.yearLabel ? ` · ${current.yearLabel}` : ""}
          </span>
        </button>

        <FurtherButton
          disabled={!canAdvance}
          onAdvance={onAdvance}
          onHold={() => onSheetOpenChange(true)}
        />

        {behind ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-[#c4a574]"
            onClick={onReturnLatest}
          >
            Return to latest
          </Button>
        ) : canUndo ? (
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-[#c4a574] sm:inline-flex"
            onClick={onUndo}
          >
            Undo
          </Button>
        ) : null}
      </div>

      {showWalkBack ? (
        <div
          className="inline-flex self-start rounded-sm border border-[#c4a574]/25 p-0.5 sm:self-end"
          role="group"
          aria-label="Map mode"
        >
          <ModeButton
            pressed={!walkBack}
            onClick={() => onWalkBackChange(false)}
          >
            You are here
          </ModeButton>
          <ModeButton pressed={walkBack} onClick={() => onWalkBackChange(true)}>
            Walk back
          </ModeButton>
        </div>
      ) : null}

      <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
        <SheetContent
          side="top"
          className="z-[2000] max-h-[min(82dvh,40rem)] gap-0 overflow-hidden border-[#c4a574]/25 bg-[#1a1410] p-0 data-[side=top]:max-h-[min(82dvh,40rem)]"
        >
          <div className="shrink-0 border-b border-[#c4a574]/20 px-4 py-3 md:px-6">
            <SheetTitle className="font-serif text-xl text-[#f0e6d4]">
              Your place in the book
            </SheetTitle>
            <SheetDescription className="text-[#c4b49a]">
              Only moments you have already reached are named.
            </SheetDescription>
          </div>
          <ProgressSheetBody
            beats={beats}
            chapters={chapters}
            progressId={progressId}
            furthestId={furthestId}
            reached={reached}
            behind={behind}
            canAdvance={canAdvance}
            canUndo={canUndo}
            onCatchUp={onCatchUp}
            onUndo={onUndo}
            onSelectBeat={(id) => {
              onSelectBeat(id);
              onSheetOpenChange(false);
            }}
            onSelectChapter={(id) => {
              onSelectChapter(id);
              onSheetOpenChange(false);
            }}
            onReturnLatest={() => {
              onReturnLatest();
              onSheetOpenChange(false);
            }}
            onReset={() => {
              onReset();
              onSheetOpenChange(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FurtherButton({
  disabled,
  onAdvance,
  onHold,
}: {
  disabled: boolean;
  onAdvance: () => void;
  onHold: () => void;
}) {
  const timer = useRef<number | null>(null);
  const held = useRef(false);

  function clearTimer() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  return (
    <Button
      size="sm"
      disabled={disabled}
      title={
        disabled
          ? "The map has not been drawn further yet"
          : "Advance one moment. Hold to catch up."
      }
      className="shrink-0 bg-[#e8c989] font-serif text-[#120e0b] hover:bg-[#f0e6d4]"
      onPointerDown={() => {
        if (disabled) return;
        held.current = false;
        clearTimer();
        timer.current = window.setTimeout(() => {
          held.current = true;
          onHold();
        }, HOLD_MS);
      }}
      onPointerUp={() => {
        const wasHeld = held.current;
        clearTimer();
        if (!disabled && !wasHeld) onAdvance();
      }}
      onPointerLeave={clearTimer}
      onPointerCancel={clearTimer}
      onContextMenu={(event) => event.preventDefault()}
    >
      I’ve read further
    </Button>
  );
}

function ModeButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-sm px-2.5 py-1 text-[0.7rem] transition ${
        pressed
          ? "bg-[#c4a574]/20 text-[#f0e6d4]"
          : "text-[#c4b49a] hover:text-[#f0e6d4]"
      }`}
    >
      {children}
    </button>
  );
}

function ProgressSheetBody({
  beats,
  chapters,
  progressId,
  furthestId,
  reached,
  behind,
  canAdvance,
  canUndo,
  onCatchUp,
  onUndo,
  onSelectBeat,
  onSelectChapter,
  onReturnLatest,
  onReset,
}: {
  beats: Beat[];
  chapters: Chapter[];
  progressId: string;
  furthestId: string;
  reached: Beat[];
  behind: boolean;
  canAdvance: boolean;
  canUndo: boolean;
  onCatchUp: (steps: number) => void;
  onUndo: () => void;
  onSelectBeat: (beatId: string) => void;
  onSelectChapter: (chapterId: string) => void;
  onReturnLatest: () => void;
  onReset: () => void;
}) {
  const [showChapters, setShowChapters] = useState(false);
  const left = remainingSteps(beats, furthestId);
  const chapterIndex = Math.max(
    0,
    chapters.findIndex(
      (chapter) => chapter.id === beatById(beats, progressId)?.chapterId,
    ),
  );

  const parts = chapters.filter((chapter) =>
    reached.some((beat) => beat.chapterId === chapter.id),
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6">
      {behind ? (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-sm border border-[#c4a574]/25 bg-[#120e0b] px-3 py-2">
          <p className="text-sm text-[#d7c7a8]">You stepped back from your latest moment.</p>
          <Button size="sm" onClick={onReturnLatest}>
            Return to latest
          </Button>
        </div>
      ) : null}

      <div className="space-y-4">
        {parts.map((part) => (
          <section key={part.id}>
            <h3 className="font-[family-name:var(--font-cinzel)] text-[0.62rem] tracking-[0.2em] text-[#c4a574] uppercase">
              {part.part}
            </h3>
            <ul className="mt-2 space-y-1">
              {reached
                .filter((beat) => beat.chapterId === part.id)
                .map((beat) => {
                  const current = beat.id === progressId;
                  return (
                    <li key={beat.id}>
                      <button
                        type="button"
                        onClick={() => onSelectBeat(beat.id)}
                        className={`w-full rounded-sm px-2 py-1.5 text-left ${
                          current
                            ? "bg-[#c4a574]/15 text-[#f0e6d4]"
                            : "text-[#d7c7a8] hover:bg-[#c4a574]/10"
                        }`}
                      >
                        <span className="font-serif text-base">{beat.title}</span>
                        <span className="mt-0.5 block text-[0.7rem] text-[#c4b49a]">
                          {beat.placeLabel}
                          {beat.moodLabel ? ` · ${beat.moodLabel}` : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>

      {canAdvance ? (
        <section className="mt-5 border-t border-[#c4a574]/15 pt-4">
          <h3 className="font-serif text-base text-[#f0e6d4]">
            I’ve already read further
          </h3>
          <p className="mt-1 text-sm text-[#c4b49a]">
            Advance unmarked moments. Their names stay hidden until you take them.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[1, 2, 3].map((steps) => (
              <Button
                key={steps}
                variant="outline"
                size="sm"
                onClick={() => onCatchUp(steps)}
              >
                Advance {steps} {steps === 1 ? "moment" : "moments"}
              </Button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-5 border-t border-[#c4a574]/15 pt-4">
        <button
          type="button"
          className="text-sm text-[#c4a574] underline-offset-2 hover:underline"
          onClick={() => setShowChapters((open) => !open)}
        >
          I’m in a numbered chapter
        </button>
        {showChapters ? (
          <div className="mt-3 space-y-3">
            <Slider
              min={0}
              max={Math.max(chapters.length - 1, 0)}
              step={1}
              value={[chapterIndex]}
              onValueChange={(value) => {
                const next = chapters[value[0] ?? 0];
                if (next) onSelectChapter(next.id);
              }}
              aria-label="Chapter progress"
            />
            <ul className="space-y-1">
              {chapters.map((chapter) => {
                const known = reached.some((beat) => beat.chapterId === chapter.id);
                return (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      onClick={() => onSelectChapter(chapter.id)}
                      className="w-full rounded-sm px-2 py-1.5 text-left text-sm text-[#d7c7a8] hover:bg-[#c4a574]/10"
                    >
                      {known ? (
                        <>
                          <span className="text-[#c4a574]">{chapter.part}</span>
                          <span className="mt-0.5 block font-serif text-base text-[#f0e6d4]">
                            {chapter.title}
                          </span>
                        </>
                      ) : (
                        <span className="font-serif text-base text-[#f0e6d4]">
                          {/^chapter\s+\d+/i.test(chapter.title)
                            ? chapter.title
                            : "A later chapter"}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </section>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#c4a574]/15 pt-4">
        {canUndo ? (
          <Button variant="ghost" size="sm" className="text-[#c4a574]" onClick={onUndo}>
            Undo last advance
          </Button>
        ) : null}
        {progressId !== beats[0]?.id ? (
          <Button variant="ghost" size="sm" className="text-[#c4a574]" onClick={onReset}>
            Back to dawn
          </Button>
        ) : null}
        {!canAdvance && left === 0 ? (
          <p className="text-xs text-[#c4b49a]">
            The map has not been drawn further yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
