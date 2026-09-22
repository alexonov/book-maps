import type { Beat, Chapter } from "@/data/types";
import { beatById, beatOrder, migrateStoredId } from "@/lib/beats";

const STORAGE_KEY = "book-maps:shadow-of-the-wind:beat";
const LEGACY_KEY = "book-maps:shadow-of-the-wind:progress";

export type ProgressState = {
  progressId: string;
  furthestId: string;
};

const listeners = new Set<() => void>();
let snapshot: ProgressState | null = null;
let snapshotKey = "";

function notify() {
  snapshot = null;
  snapshotKey = "";
  listeners.forEach((listener) => listener());
}

function parseState(raw: string | null): ProgressState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (
      typeof parsed.progressId === "string" &&
      typeof parsed.furthestId === "string"
    ) {
      return { progressId: parsed.progressId, furthestId: parsed.furthestId };
    }
  } catch {
    return { progressId: raw, furthestId: raw };
  }
  return null;
}

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_KEY)
    );
  } catch {
    return null;
  }
}

export function normalizeProgress(
  stored: ProgressState | null,
  beats: Beat[],
  chapters: Chapter[],
  fallbackId: string,
): ProgressState {
  const progressId =
    migrateStoredId(stored?.progressId ?? "", beats, chapters) ?? fallbackId;
  const furthestCandidate =
    migrateStoredId(stored?.furthestId ?? "", beats, chapters) ?? progressId;
  const furthestId =
    beatOrder(beats, furthestCandidate) >= beatOrder(beats, progressId)
      ? furthestCandidate
      : progressId;

  if (!beatById(beats, progressId)) {
    return { progressId: fallbackId, furthestId: fallbackId };
  }

  return { progressId, furthestId };
}

export function getProgress(
  beats: Beat[],
  chapters: Chapter[],
  fallbackId: string,
): ProgressState {
  const raw = readRaw() ?? "";
  const key = `${raw}::${fallbackId}`;
  if (snapshot && snapshotKey === key) return snapshot;
  snapshot = normalizeProgress(parseState(raw || null), beats, chapters, fallbackId);
  snapshotKey = key;
  return snapshot;
}

const serverSnapshots = new Map<string, ProgressState>();

export function getServerProgress(fallbackId: string): ProgressState {
  const existing = serverSnapshots.get(fallbackId);
  if (existing) return existing;
  const next = { progressId: fallbackId, furthestId: fallbackId };
  serverSnapshots.set(fallbackId, next);
  return next;
}

export function subscribeProgress(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function saveProgress(next: ProgressState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Private mode or blocked storage should not break the map.
  }
  notify();
}
