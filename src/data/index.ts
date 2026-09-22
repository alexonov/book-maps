import type {
  Beat,
  BookCatalog,
  Chapter,
  Character,
  Journey,
  Location,
} from "@/data/types";
import chapters from "@/data/chapters.json";
import beats from "@/data/beats.json";
import locations from "@/data/locations.json";
import journeys from "@/data/journeys.json";
import characters from "@/data/characters.json";

export const catalog: BookCatalog = {
  book: {
    title: "The Shadow of the Wind",
    author: "Carlos Ruiz Zafón",
    originalTitle: "La sombra del viento",
  },
  chapters: chapters as Chapter[],
  beats: beats as Beat[],
  locations: locations as Location[],
  journeys: journeys as Journey[],
  characters: characters as Character[],
};

export const BARCELONA_CENTER = { lat: 41.3828, lng: 2.1742 };
