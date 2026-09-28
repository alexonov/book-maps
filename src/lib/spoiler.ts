import type { Beat, Character, Journey, Location } from "@/data/types";
import { beatOrder } from "@/lib/beats";

export function isRevealed(
  beats: Beat[],
  revealedIn: string,
  progressId: string,
): boolean {
  return beatOrder(beats, revealedIn) <= beatOrder(beats, progressId);
}

export function visibleCharacters(
  beats: Beat[],
  characters: Character[],
  progressId: string,
): Character[] {
  return characters.filter((character) =>
    isRevealed(beats, character.revealedIn, progressId),
  );
}

export function visibleLocations(
  beats: Beat[],
  locations: Location[],
  progressId: string,
  options: { showBackground: boolean; characterIds: string[] },
): Location[] {
  const allowedCharacters = new Set(options.characterIds);

  return locations.filter((location) => {
    if (!isRevealed(beats, location.revealedIn, progressId)) return false;
    if (location.background && !options.showBackground) return false;
    if (allowedCharacters.size === 0) return true;
    return location.characterIds.some((id) => allowedCharacters.has(id));
  });
}

export function visibleJourneys(
  beats: Beat[],
  journeys: Journey[],
  progressId: string,
  options: { showAllRoutes: boolean; characterIds: string[] },
): Journey[] {
  const allowedCharacters = new Set(options.characterIds);

  return journeys.filter((journey) => {
    if (!isRevealed(beats, journey.revealedIn, progressId)) return false;
    if (!options.showAllRoutes && journey.revealedIn !== progressId) return false;
    if (allowedCharacters.size === 0) return true;
    return journey.characterIds.some((id) => allowedCharacters.has(id));
  });
}
