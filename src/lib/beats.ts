import type { Beat, Chapter, Location } from "@/data/types";

export function beatById(beats: Beat[], id: string): Beat | undefined {
  return beats.find((beat) => beat.id === id);
}

export function beatOrder(beats: Beat[], id: string): number {
  return beatById(beats, id)?.order ?? Number.POSITIVE_INFINITY;
}

export function chapterById(
  chapters: Chapter[],
  id: string,
): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function lastBeatForChapter(
  beats: Beat[],
  chapterId: string,
): Beat | undefined {
  return beats
    .filter((beat) => beat.chapterId === chapterId)
    .reduce<Beat | undefined>(
      (latest, beat) =>
        !latest || beat.order > latest.order ? beat : latest,
      undefined,
    );
}

export function nextBeat(beats: Beat[], id: string): Beat | undefined {
  const current = beatById(beats, id);
  if (!current) return beats[0];
  return beats.find((beat) => beat.order === current.order + 1);
}

export function beatAfterSteps(
  beats: Beat[],
  id: string,
  steps: number,
): Beat | undefined {
  const current = beatById(beats, id);
  if (!current) return beats[0];
  const target = current.order + Math.max(0, steps);
  const reached = beats.filter((beat) => beat.order <= target);
  return reached[reached.length - 1];
}

export function reachedBeats(beats: Beat[], furthestId: string): Beat[] {
  const limit = beatOrder(beats, furthestId);
  return beats.filter((beat) => beat.order <= limit);
}

export function remainingSteps(beats: Beat[], furthestId: string): number {
  const last = beats[beats.length - 1];
  if (!last) return 0;
  return Math.max(0, last.order - beatOrder(beats, furthestId));
}

export function visitBeatId(
  location: Location,
  beats: Beat[],
  progressId: string,
): string {
  const allowed = location.activeIn.filter(
    (id) => beatOrder(beats, id) <= beatOrder(beats, progressId),
  );
  return allowed[allowed.length - 1] ?? location.revealedIn;
}

export function migrateStoredId(
  stored: string,
  beats: Beat[],
  chapters: Chapter[],
): string | undefined {
  if (beatById(beats, stored)) return stored;
  if (chapterById(chapters, stored)) {
    return lastBeatForChapter(beats, stored)?.id;
  }
  return undefined;
}
