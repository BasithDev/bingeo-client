import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import type { Episode, Season } from "../../types/content.types";

interface SeasonManagerProps {
  seasons: Season[];
  onChange: (seasons: Season[]) => void;
}

export function SeasonManager({ seasons, onChange }: SeasonManagerProps) {
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(
    new Set(seasons.map((s) => s.number)),
  );

  const toggleExpand = (num: number) => {
    setExpandedSeasons((prev) => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
  };

  /* ── Season CRUD ─────────────────────────────── */

  const addSeason = () => {
    const num = seasons.length + 1;
    const newSeason: Season = {
      number: num,
      title: `Season ${num}`,
      episodes: [{ number: 1, title: "", plot: "", duration: "" }],
    };
    onChange([...seasons, newSeason]);
    setExpandedSeasons((prev) => new Set(prev).add(num));
  };

  const removeSeason = (idx: number) => {
    const updated = seasons
      .filter((_, i) => i !== idx)
      .map((s, i) => ({
        ...s,
        number: i + 1,
        title: s.title.startsWith("Season ") ? `Season ${i + 1}` : s.title,
      }));
    onChange(updated);
  };

  const updateSeasonTitle = (idx: number, title: string) => {
    onChange(seasons.map((s, i) => (i === idx ? { ...s, title } : s)));
  };

  /* ── Episode CRUD ────────────────────────────── */

  const addEpisode = (seasonIdx: number) => {
    onChange(
      seasons.map((s, i) => {
        if (i !== seasonIdx) return s;
        const ep: Episode = {
          number: s.episodes.length + 1,
          title: "",
          plot: "",
          duration: "",
        };
        return { ...s, episodes: [...s.episodes, ep] };
      }),
    );
  };

  const removeEpisode = (seasonIdx: number, epIdx: number) => {
    onChange(
      seasons.map((s, i) => {
        if (i !== seasonIdx) return s;
        const eps = s.episodes
          .filter((_, j) => j !== epIdx)
          .map((ep, j) => ({ ...ep, number: j + 1 }));
        return { ...s, episodes: eps };
      }),
    );
  };

  const updateEpisode = (seasonIdx: number, epIdx: number, field: keyof Episode, value: string) => {
    onChange(
      seasons.map((s, i) => {
        if (i !== seasonIdx) return s;
        return {
          ...s,
          episodes: s.episodes.map((ep, j) => (j === epIdx ? { ...ep, [field]: value } : ep)),
        };
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Seasons & Episodes</label>
        <button
          type="button"
          onClick={addSeason}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium cursor-pointer",
            "text-primary hover:text-primary/80 transition-colors",
          )}
        >
          <Plus className="h-3.5 w-3.5" /> Add Season
        </button>
      </div>

      {seasons.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No seasons added yet. Click "Add Season" to get started.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {seasons.map((season, sIdx) => {
          const expanded = expandedSeasons.has(season.number);
          return (
            <div
              key={season.number}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Season header */}
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer",
                  "hover:bg-muted/30 transition-colors",
                )}
                onClick={() => toggleExpand(season.number)}
              >
                <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                  S{season.number}
                </div>
                <input
                  type="text"
                  value={season.title}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateSeasonTitle(sIdx, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-transparent text-sm font-medium text-foreground focus:outline-none"
                  placeholder="Season title"
                />
                <span className="text-[10px] text-muted-foreground mr-2">
                  {season.episodes.length} ep{season.episodes.length !== 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSeason(sIdx);
                  }}
                  className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                {expanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {/* Episodes */}
              {expanded && (
                <div className="border-t border-border px-4 py-3 space-y-3">
                  {season.episodes.map((ep, eIdx) => (
                    <div
                      key={eIdx}
                      className="rounded-lg border border-border/60 bg-muted/10 p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">
                          E{ep.number}
                        </span>
                        <input
                          type="text"
                          value={ep.title}
                          onChange={(e) => updateEpisode(sIdx, eIdx, "title", e.target.value)}
                          placeholder="Episode title"
                          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={ep.duration}
                          onChange={(e) => updateEpisode(sIdx, eIdx, "duration", e.target.value)}
                          placeholder="Duration"
                          className="w-20 text-right bg-transparent text-xs text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeEpisode(sIdx, eIdx)}
                          className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <textarea
                        value={ep.plot}
                        onChange={(e) => updateEpisode(sIdx, eIdx, "plot", e.target.value)}
                        placeholder="Episode plot / description..."
                        rows={2}
                        className="w-full bg-transparent text-xs text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addEpisode(sIdx)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium cursor-pointer",
                      "text-primary/70 hover:text-primary transition-colors",
                    )}
                  >
                    <Plus className="h-3 w-3" /> Add Episode
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
