import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Film,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Tv,
  Users as UsersIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { contentService } from "@/services/api";
import type { ContentMetadata, ContentType } from "../types/content.types";
import { formatDate } from "../utils/helpers";



const PAGE_SIZE = 5;

const TYPE_META: Record<
  ContentType,
  { Icon: typeof Film; label: string; accent: string; glow: string }
> = {
  movie: {
    Icon: Film,
    label: "Movie",
    accent: "from-blue-500/15 to-transparent",
    glow: "text-blue-400",
  },
  series: {
    Icon: Tv,
    label: "Series",
    accent: "from-violet-500/15 to-transparent",
    glow: "text-violet-400",
  },
  special: {
    Icon: Sparkles,
    label: "Special",
    accent: "from-amber-500/15 to-transparent",
    glow: "text-amber-400",
  },
};


   
   

export function ContentDraftsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const draftsQuery = useQuery<ContentMetadata[]>({
    queryKey: ["content", "drafts"],
    queryFn: () => contentService.listDrafts(),
  });

  const drafts = draftsQuery.data ?? [];

  

  const filtered = useMemo(() => {
    if (!search.trim()) return drafts;
    const q = search.toLowerCase();
    return drafts.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.genres.some((g) => g.toLowerCase().includes(q)) ||
        d.plot.toLowerCase().includes(q) ||
        d.cast.some((c) => c.name.toLowerCase().includes(q)),
    );
  }, [drafts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useMemo(() => {
    setPage(1);
  }, [search]);

  

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentService.deleteDraft(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "drafts"] });
    },
  });

  const deleteDraft = (id: string) => {
    deleteMutation.mutate(id);
  };

  const resumeDraft = (id: string) => {
    navigate({ to: "/admin/content/upload", search: { draft: id } });
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Content Drafts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} draft{filtered.length !== 1 ? "s" : ""}{" "}
            {search && `matching "${search}"`}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/admin/content/upload",
              search: { draft: undefined },
            })
          }
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer",
            "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
          )}
        >
          <Plus className="h-4 w-4" /> New Content
        </button>
      </div>

      
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, genre, type, cast..."
          className={cn(
            "w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
          )}
        />
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/10 py-20 text-center">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Film className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-foreground">
            {search ? "No drafts found" : "No drafts yet"}
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {search
              ? `No results for "${search}". Try a different keyword.`
              : "Start by creating new content — your progress will be saved automatically"}
          </p>
          {!search && (
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/admin/content/upload",
                  search: { draft: undefined },
                })
              }
              className={cn(
                "mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
              )}
            >
              <Plus className="h-4 w-4" /> Create Content
            </button>
          )}
        </div>
      ) : (
        <>
          
          <div className="space-y-3">
            {paginated.map((draft) => {
              const meta = TYPE_META[draft.type];
              const totalEpisodes = draft.seasons.reduce((sum, s) => sum + s.episodes.length, 0);

              return (
                <div
                  key={draft.id}
                  className={cn(
                    "group relative rounded-2xl border border-border bg-card overflow-hidden",
                    "hover:border-primary/25 transition-all duration-200",
                  )}
                >
                  
                  <div
                    className={cn(
                      "absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                      meta.accent,
                    )}
                  />

                  <div className="relative z-10 flex items-stretch">
          
                    <div className="flex-1 p-4 md:p-5 min-w-0">
                      <div className="flex items-start justify-between gap-4">
              
                        <button
                          type="button"
                          className="flex-1 min-w-0 cursor-pointer text-left border-0 p-0 bg-transparent"
                          onClick={() => resumeDraft(draft.id)}
                        >
                
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div
                              className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                                "bg-muted/60",
                                meta.glow,
                              )}
                            >
                              <meta.Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base md:text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                {draft.title || "Untitled"}
                              </h3>
                            </div>
                          </div>

                          
                          {draft.plot ? (
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1 ml-[42px]">
                              {draft.plot}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground/40 italic mt-1 ml-[42px]">
                              No description added
                            </p>
                          )}

                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 ml-[42px] text-xs text-muted-foreground">
                            <span className={cn("font-semibold", meta.glow)}>{meta.label}</span>
                            {draft.duration && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {draft.duration}
                              </span>
                            )}
                            {draft.genres.length > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {draft.genres.join(", ")}
                              </span>
                            )}
                            {draft.cast.length > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <UsersIcon className="h-3 w-3" />
                                {draft.cast.length} cast
                              </span>
                            )}
                            {draft.type === "series" && draft.seasons.length > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <Tv className="h-3 w-3" />
                                {draft.seasons.length}S · {totalEpisodes}E
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(draft.updatedAt)}
                            </span>
                          </div>
                        </button>

                        
                        <div className="flex items-center gap-2 shrink-0 pt-1">
                          <button
                            type="button"
                            onClick={() => deleteDraft(draft.id)}
                            className={cn(
                              "p-2 rounded-lg text-muted-foreground cursor-pointer",
                              "hover:text-red-500 hover:bg-red-500/10 transition-all",
                              "opacity-0 group-hover:opacity-100",
                            )}
                            title="Delete draft"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => resumeDraft(draft.id)}
                            className={cn(
                              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer",
                              "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                            )}
                          >
                            Resume <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className={cn(
                    "p-2 rounded-lg text-sm cursor-pointer transition-colors",
                    "hover:bg-muted",
                    currentPage <= 1 && "opacity-30 cursor-not-allowed hover:bg-transparent",
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-medium cursor-pointer transition-colors",
                      n === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className={cn(
                    "p-2 rounded-lg text-sm cursor-pointer transition-colors",
                    "hover:bg-muted",
                    currentPage >= totalPages &&
                      "opacity-30 cursor-not-allowed hover:bg-transparent",
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
