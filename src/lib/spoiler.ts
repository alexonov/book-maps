import type {
  Chapter,
  Character,
  Journey,
  Location,
} from "@/data/types";

export function chapterById(
  chapters: Chapter[],
  id: string,
): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function chapterOrder(chapters: Chapter[], id: string): number {
  return chapterById(chapters, id)?.order ?? Number.POSITIVE_INFINITY;
}

export function isRevealed(
  chapters: Chapter[],
  revealedIn: string,
  progressId: string,
): boolean {
  return chapterOrder(chapters, revealedIn) <= chapterOrder(chapters, progressId);
}

export function visibleChapters(
  chapters: Chapter[],
  progressId: string,
): Chapter[] {
  const limit = chapterOrder(chapters, progressId);
  return chapters.filter((chapter) => chapter.order <= limit);
}

export function visibleCharacters(
  chapters: Chapter[],
  characters: Character[],
  progressId: string,
): Character[] {
  return characters.filter((character) =>
    isRevealed(chapters, character.revealedIn, progressId),
  );
}

export function visibleLocations(
  chapters: Chapter[],
  locations: Location[],
  progressId: string,
  options: { showBackground: boolean; characterIds: string[] },
): Location[] {
  const allowedCharacters = new Set(options.characterIds);

  return locations.filter((location) => {
    if (!isRevealed(chapters, location.revealedIn, progressId)) return false;
    if (location.background && !options.showBackground) return false;
    if (allowedCharacters.size === 0) return true;
    return location.characterIds.some((id) => allowedCharacters.has(id));
  });
}

export function visibleJourneys(
  chapters: Chapter[],
  journeys: Journey[],
  progressId: string,
  options: { showRoutes: boolean; characterIds: string[] },
): Journey[] {
  if (!options.showRoutes) return [];
  const allowedCharacters = new Set(options.characterIds);

  return journeys.filter((journey) => {
    if (!isRevealed(chapters, journey.revealedIn, progressId)) return false;
    if (allowedCharacters.size === 0) return true;
    return journey.characterIds.some((id) => allowedCharacters.has(id));
  });
}

export function notesForProgress(
  location: Location,
  chapters: Chapter[],
  progressId: string,
): string[] {
  return (location.notesByChapter ?? [])
    .filter((note) => isRevealed(chapters, note.chapterId, progressId))
    .map((note) => note.text);
}
