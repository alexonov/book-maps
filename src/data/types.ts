export const MARKER_TYPES = [
  "bookshop",
  "library",
  "home",
  "street",
  "institution",
  "event",
] as const;

export type MarkerType = (typeof MARKER_TYPES)[number];

export type LatLng = {
  lat: number;
  lng: number;
};

export type PlaceNames = {
  ca: string;
  es: string;
  en: string;
};

export type Chapter = {
  id: string;
  order: number;
  part: string;
  title: string;
  yearLabel: string;
  synopsis: string;
};

export type ChapterNote = {
  /** Chapter at which this extra sentence becomes safe to show. */
  chapterId: string;
  text: string;
};

export type Location = {
  id: string;
  names: PlaceNames;
  type: MarkerType;
  lat: number;
  lng: number;
  /** First chapter in which this place may appear. */
  revealedIn: string;
  /** Chapters where this place is the scene of the action. */
  activeIn: string[];
  characterIds: string[];
  blurb: string;
  notesByChapter?: ChapterNote[];
  address?: string;
  neighborhood?: string;
  fictional: boolean;
  approximate: boolean;
  /** Known historically or as neighborhood texture, not a plot beat. */
  background?: boolean;
  streetViewUrl?: string;
  osmUrl?: string;
};

export type Journey = {
  id: string;
  name: string;
  revealedIn: string;
  characterIds: string[];
  description: string;
  path: LatLng[];
};

export type Character = {
  id: string;
  name: string;
  revealedIn: string;
  role: string;
};

export type BookCatalog = {
  book: {
    title: string;
    author: string;
    originalTitle: string;
  };
  chapters: Chapter[];
  locations: Location[];
  journeys: Journey[];
  characters: Character[];
};
