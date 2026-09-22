import type { MarkerType } from "@/data/types";

export const MARKER_LABELS: Record<MarkerType, string> = {
  bookshop: "Bookshop",
  library: "Library",
  home: "Home",
  street: "Street",
  institution: "Institution",
  event: "Key event",
};

export const MARKER_SYMBOLS: Record<MarkerType, string> = {
  bookshop: "B",
  library: "L",
  home: "H",
  street: "S",
  institution: "I",
  event: "E",
};
