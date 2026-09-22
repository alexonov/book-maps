"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Chapter } from "@/data/types";

type ProgressControlProps = {
  chapters: Chapter[];
  progressId: string;
  onChange: (chapterId: string) => void;
};

export function ProgressControl({
  chapters,
  progressId,
  onChange,
}: ProgressControlProps) {
  const current = chapters.find((chapter) => chapter.id === progressId);
  const index = Math.max(
    0,
    chapters.findIndex((chapter) => chapter.id === progressId),
  );
  const parts = [...new Set(chapters.map((chapter) => chapter.part))];

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[0.65rem] tracking-[0.24em] text-[#c4a574] uppercase">
          I have read through
        </p>
        <Select value={progressId} onValueChange={onChange}>
          <SelectTrigger
            size="sm"
            className="h-8 w-full max-w-md min-w-0 border-[#c4a574]/35 bg-[#1a1410]/80 text-[#f0e6d4] sm:min-w-[16rem]"
            aria-label="Reader progress"
          >
            <SelectValue placeholder="Choose a chapter" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[2000]">
            {parts.map((part) => (
              <SelectGroup key={part}>
                <SelectLabel>{part}</SelectLabel>
                {chapters
                  .filter((chapter) => chapter.part === part)
                  .map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </SelectItem>
                  ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <Slider
          min={0}
          max={Math.max(chapters.length - 1, 0)}
          step={1}
          value={[index]}
          onValueChange={(value) => {
            const next = chapters[value[0] ?? 0];
            if (next) onChange(next.id);
          }}
          aria-label="Chapter progress"
          className="max-w-xs"
        />
        {current ? (
          <p className="hidden text-xs text-[#c4b49a] sm:block">
            {current.part}
          </p>
        ) : null}
        {index > 0 ? (
          <Button
            variant="ghost"
            size="xs"
            className="text-[#c4a574]"
            onClick={() => onChange(chapters[0].id)}
          >
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}
