const STORAGE_KEY = "book-maps:shadow-of-the-wind:progress";

const listeners = new Set<() => void>();

function readStored(fallbackId: string): string {
  if (typeof window === "undefined") return fallbackId;
  try {
    return window.localStorage.getItem(STORAGE_KEY) || fallbackId;
  } catch {
    return fallbackId;
  }
}

export function getProgress(fallbackId: string): string {
  return readStored(fallbackId);
}

export function getServerProgress(fallbackId: string): string {
  return fallbackId;
}

export function subscribeProgress(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function saveProgress(chapterId: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, chapterId);
  } catch {
    // Private mode or blocked storage should not break the map.
  }
  listeners.forEach((listener) => listener());
}
