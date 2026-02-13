import { cn } from "@/utils/cn";
import { GENRES } from "../../data/mockContent";

interface GenrePickerProps {
  selected: string[];
  onChange: (genres: string[]) => void;
}

export function GenrePicker({ selected, onChange }: GenrePickerProps) {
  const toggle = (genre: string) => {
    onChange(selected.includes(genre) ? selected.filter((g) => g !== genre) : [...selected, genre]);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground block">Genres</legend>
      <div className="flex flex-wrap gap-2">
        {GENRES.map((g) => {
          const active = selected.includes(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => toggle(g)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer",
                "border transition-all duration-150",
                active
                  ? "bg-primary/10 text-primary border-primary/40"
                  : "bg-muted/40 text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {g}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-[11px] text-muted-foreground">
          {selected.length} genre{selected.length > 1 ? "s" : ""} selected
        </p>
      )}
    </fieldset>
  );
}
