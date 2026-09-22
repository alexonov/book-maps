"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Character } from "@/data/types";

type CharacterFiltersProps = {
  characters: Character[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
};

export function CharacterFilters({
  characters,
  selectedIds,
  onToggle,
  onClear,
}: CharacterFiltersProps) {
  if (characters.length === 0) {
    return (
      <p className="text-sm text-[#c4b49a]">
        No characters have entered the story yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.65rem] tracking-[0.24em] text-[#c4a574] uppercase">
          Characters
        </p>
        {selectedIds.length > 0 ? (
          <Button variant="ghost" size="xs" onClick={onClear}>
            Show all
          </Button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {characters.map((character) => {
          const active = selectedIds.includes(character.id);
          return (
            <button
              key={character.id}
              type="button"
              onClick={() => onToggle(character.id)}
              className={`rounded-full border px-2.5 py-1 text-left text-xs transition ${
                active
                  ? "border-[#c4a574] bg-[#c4a574]/20 text-[#f0e6d4]"
                  : "border-[#c4a574]/25 bg-[#1a1410]/60 text-[#d7c7a8] hover:border-[#c4a574]/60"
              }`}
              aria-pressed={active}
            >
              {character.name}
            </button>
          );
        })}
      </div>
      {selectedIds.length === 1 &&
      characters.find((character) => character.id === selectedIds[0])?.id ===
        "tomas" ? (
        <Badge variant="secondary" className="w-fit">
          Mentioned only — no pins yet
        </Badge>
      ) : null}
    </div>
  );
}
