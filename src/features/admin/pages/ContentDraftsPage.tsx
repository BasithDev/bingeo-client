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
import type { IContentMetadata as ContentMetadata, ContentType } from "../types/content.types";
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
          {/* Grid Layout - Smaller Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((draft) => {
              const meta = TYPE_META[draft.type as ContentType] || TYPE_META.movie;
              const totalEpisodes = draft.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
              const topCast = draft.cast.slice(0, 3);
              const remainingCast = draft.cast.length - 3;

              return (
                <div
                  key={draft.id}
                  className={cn(
                    "group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden",
                    "hover:border-primary/40 hover:shadow-xl transition-all duration-300",
                  )}
                >
                  {/* Poster Placeholder Area - Reduced height */}
                  <div className="relative aspect-[16/10] bg-muted/20 overflow-hidden flex items-center justify-center">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-30 transition-opacity duration-500",
                        meta.accent,
                      )}
                    />
                    
                    {/* Icon */}
                    <div className={cn(
                      "relative z-10 h-10 w-10 rounded-xl bg-background/40 backdrop-blur-sm flex items-center justify-center",
                      "border border-white/5 transition-transform duration-500 group-hover:scale-110",
                      meta.glow
                    )}>
                      <meta.Icon className="h-5 w-5" />
                    </div>

                    {/* Hover Actions Overlay - Compact */}
                    <div className="absolute inset-0 z-30 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => resumeDraft(draft.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground",
                          "transition-all duration-300 hover:scale-105 group/btn overflow-hidden max-w-[40px] hover:max-w-[120px]"
                        )}
                        title="Resume editing"
                      >
                        <ArrowRight className="h-4 w-4 shrink-0" />
                        <span className="text-[10px] whitespace-nowrap opacity-0 group-hover/btn:opacity-100 font-bold uppercase tracking-tight">Resume</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDraft(draft.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-500",
                          "transition-all duration-300 hover:scale-105 group/del overflow-hidden max-w-[40px] hover:max-w-[120px] border border-red-500/20"
                        )}
                        title="Delete draft"
                      >
                        <Trash2 className="h-4 w-4 shrink-0" />
                        <span className="text-[10px] whitespace-nowrap opacity-0 group-hover/del:opacity-100 font-bold uppercase tracking-tight">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-3.5 flex-1 flex flex-col gap-2.5">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {draft.title || "Untitled Draft"}
                        </h3>
                        <span className={cn("text-[9px] font-black uppercase shrink-0 transition-colors", meta.glow)}>
                          {meta.label}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-muted-foreground line-clamp-1 opacity-70">
                        {draft.plot || "No plot added..."}
                      </p>
                    </div>

                    {/* Cast Avatar Stack */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        {topCast.map((member, i) => (
                          <div 
                            key={member.id} 
                            className="h-6 w-6 rounded-full border-2 border-card bg-muted ring-1 ring-white/5 overflow-hidden"
                            title={member.name}
                          >
                            {member.profilePath ? (
                              <img src={member.profilePath} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[8px] font-bold">
                                {member.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        ))}
                        {remainingCast > 0 && (
                          <div className="h-6 w-6 rounded-full border-2 border-card bg-muted-foreground/10 flex items-center justify-center text-[8px] font-black text-muted-foreground ring-1 ring-white/5">
                            +{remainingCast}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                        {draft.type === "series" ? (
                          <span className="flex items-center gap-1">
                            <Tv className="h-3 w-3" /> {draft.seasons.length}S · {totalEpisodes}E
                          </span>
                        ) : draft.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {draft.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Footer - Timestamps */}
                    <div className="pt-2.5 border-t border-border/50 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[9px] text-muted-foreground/60">
                        <span>Drafted:</span>
                        <span className="font-medium text-muted-foreground">
                          {new Date(draft.createdAt).toLocaleDateString()} · {new Date(draft.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-muted-foreground/60">
                        <span>Updated:</span>
                        <span className={cn("font-bold", meta.glow)}>
                          {new Date(draft.updatedAt).toLocaleDateString()} · {new Date(draft.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Invisible Link */}
                  <button
                    type="button"
                    className="absolute inset-0 z-0 cursor-pointer"
                    onClick={() => resumeDraft(draft.id)}
                  />
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
