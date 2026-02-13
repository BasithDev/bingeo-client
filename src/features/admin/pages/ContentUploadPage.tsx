import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Film,
  Image as ImageIcon,
  Save,
  Sparkles,
  Tv,
} from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { CastSearch } from "../components/content/CastSearch";
import { GenrePicker } from "../components/content/GenrePicker";
import { MediaUploadZone } from "../components/content/MediaUploadZone";
import { SeasonManager } from "../components/content/SeasonManager";
import type { CastMember, ContentMetadata, ContentType, Season } from "../types/content.types";

/* ── Step definitions ─────────────────────────── */

interface StepDef {
  key: string;
  label: string;
  description: string;
}

const ALL_STEPS: StepDef[] = [
  { key: "type", label: "Type", description: "Choose content type" },
  { key: "details", label: "Details", description: "Metadata & info" },
  { key: "cast", label: "Cast", description: "Search & add cast" },
  { key: "seasons", label: "Seasons", description: "Episodes & seasons" },
  { key: "media", label: "Media", description: "Upload content" },
];

function getSteps(contentType: ContentType | null): StepDef[] {
  if (contentType !== "series") {
    return ALL_STEPS.filter((s) => s.key !== "seasons");
  }
  return ALL_STEPS;
}

/* ── Form state ───────────────────────────────── */

interface FormState {
  type: ContentType | null;
  title: string;
  plot: string;
  duration: string;
  posterUrl: string;
  genres: string[];
  cast: CastMember[];
  seasons: Season[];
}

type Action =
  | { kind: "SET_TYPE"; payload: ContentType }
  | { kind: "SET_FIELD"; field: "title" | "plot" | "duration" | "posterUrl"; value: string }
  | { kind: "SET_GENRES"; payload: string[] }
  | { kind: "SET_CAST"; payload: CastMember[] }
  | { kind: "SET_SEASONS"; payload: Season[] }
  | { kind: "LOAD_DRAFT"; payload: FormState };

function reducer(state: FormState, action: Action): FormState {
  switch (action.kind) {
    case "SET_TYPE":
      return {
        ...state,
        type: action.payload,
        seasons: action.payload === "series" ? state.seasons : [],
      };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_GENRES":
      return { ...state, genres: action.payload };
    case "SET_CAST":
      return { ...state, cast: action.payload };
    case "SET_SEASONS":
      return { ...state, seasons: action.payload };
    case "LOAD_DRAFT":
      return action.payload;
    default:
      return state;
  }
}

const INITIAL: FormState = {
  type: null,
  title: "",
  plot: "",
  duration: "",
  posterUrl: "",
  genres: [],
  cast: [],
  seasons: [],
};

/* ── Content-type cards ───────────────────────── */

const TYPE_OPTIONS: { value: ContentType; label: string; desc: string; Icon: typeof Film }[] = [
  { value: "movie", label: "Movie", desc: "Feature film, short film", Icon: Film },
  { value: "series", label: "Series", desc: "Multi-season, episodic", Icon: Tv },
  { value: "special", label: "Special", desc: "One-off event, live show", Icon: Sparkles },
];

/* ══════════════════════════════════════════════════
   ContentUploadPage
   ══════════════════════════════════════════════════ */

export function ContentUploadPage() {
  const navigate = useNavigate();
  const { draft: draftId } = useSearch({ strict: false }) as { draft?: string };
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [stepIdx, setStepIdx] = useState(0);
  const editingIdRef = useRef<string | null>(null);

  /* ── Load draft on mount ─────────────────────── */

  useEffect(() => {
    if (!draftId) return;
    try {
      const stored: ContentMetadata[] = JSON.parse(localStorage.getItem("bingeo-drafts") ?? "[]");
      const found = stored.find((d) => d.id === draftId);
      if (found) {
        editingIdRef.current = found.id;
        dispatch({
          kind: "LOAD_DRAFT",
          payload: {
            type: found.type,
            title: found.title,
            plot: found.plot,
            duration: found.duration,
            posterUrl: found.posterUrl || "",
            genres: found.genres,
            cast: found.cast,
            seasons: found.seasons,
          },
        });
        // Jump to details step since type is already selected
        setStepIdx(1);
      }
    } catch {
      // ignore parse errors
    }
  }, [draftId]);

  const steps = getSteps(state.type);
  const currentStep = steps[stepIdx];

  /* ── Navigation helpers ──────────────────────── */

  const canNext = useCallback(() => {
    if (!currentStep) return false;
    switch (currentStep.key) {
      case "type":
        return state.type !== null;
      case "details":
        return state.title.trim().length > 0;
      default:
        return true;
    }
  }, [currentStep, state.type, state.title]);

  const goNext = () => {
    if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1);
  };

  const goBack = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  };

  /* ── Save draft ──────────────────────────────── */

  const saveDraft = () => {
    const drafts: ContentMetadata[] = JSON.parse(localStorage.getItem("bingeo-drafts") ?? "[]");
    const now = new Date().toISOString();

    if (editingIdRef.current) {
      // Update existing draft
      const idx = drafts.findIndex((d) => d.id === editingIdRef.current);
      if (idx !== -1) {
        drafts[idx] = {
          ...drafts[idx],
          title: state.title || "Untitled",
          type: state.type ?? "movie",
          genres: state.genres,
          plot: state.plot,
          duration: state.duration,
          posterUrl: state.posterUrl || undefined,
          cast: state.cast,
          seasons: state.seasons,
          updatedAt: now,
        };
      }
    } else {
      // Create new draft
      const draft: ContentMetadata = {
        id: `draft-${Date.now()}`,
        title: state.title || "Untitled",
        type: state.type ?? "movie",
        genres: state.genres,
        plot: state.plot,
        duration: state.duration,
        posterUrl: state.posterUrl || undefined,
        cast: state.cast,
        seasons: state.seasons,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };
      drafts.push(draft);
      editingIdRef.current = draft.id;
    }

    localStorage.setItem("bingeo-drafts", JSON.stringify(drafts));
    navigate({ to: "/admin/content/drafts" });
  };

  /* ── Step content ────────────────────────────── */

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.key) {
      case "type":
        return (
          <div className="space-y-6">
            <div>
              <h2
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What are you uploading?
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Select the type of content you want to add to the platform
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TYPE_OPTIONS.map(({ value, label, desc, Icon }) => {
                const active = state.type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => dispatch({ kind: "SET_TYPE", payload: value })}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 cursor-pointer",
                      "transition-all duration-200",
                      active
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border hover:border-foreground/20 hover:bg-muted/30",
                    )}
                  >
                    <div
                      className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center",
                        active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          active ? "text-primary" : "text-foreground",
                        )}
                      >
                        {label}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-5">
            <div>
              <h2
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Content Details
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add metadata about your {state.type}
              </p>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Title *</label>
              <input
                type="text"
                value={state.title}
                onChange={(e) =>
                  dispatch({ kind: "SET_FIELD", field: "title", value: e.target.value })
                }
                placeholder="Enter content title"
                className={cn(
                  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground",
                  "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
                )}
              />
            </div>

            {/* Plot */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Plot / Description</label>
              <textarea
                value={state.plot}
                onChange={(e) =>
                  dispatch({ kind: "SET_FIELD", field: "plot", value: e.target.value })
                }
                placeholder="Write a brief synopsis..."
                rows={4}
                className={cn(
                  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground resize-none",
                  "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
                )}
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Duration
                {state.type !== "series" && (
                  <span className="text-muted-foreground font-normal ml-1.5 text-xs">
                    (auto-detected from video or enter manually)
                  </span>
                )}
              </label>
              <div className="relative w-48">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={state.duration}
                  onChange={(e) =>
                    dispatch({ kind: "SET_FIELD", field: "duration", value: e.target.value })
                  }
                  placeholder="e.g. 2h 15m"
                  className={cn(
                    "w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground",
                    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
                  )}
                />
              </div>
            </div>

            {/* Genres */}
            <GenrePicker
              selected={state.genres}
              onChange={(v) => dispatch({ kind: "SET_GENRES", payload: v })}
            />

            {/* Poster / Thumbnail URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Poster / Thumbnail
                <span className="text-muted-foreground font-normal ml-1.5 text-xs">
                  (URL or upload later)
                </span>
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={state.posterUrl}
                      onChange={(e) =>
                        dispatch({ kind: "SET_FIELD", field: "posterUrl", value: e.target.value })
                      }
                      placeholder="https://example.com/poster.jpg"
                      className={cn(
                        "w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground",
                        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
                      )}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Paste a direct image URL for the poster thumbnail
                  </p>
                </div>
                {state.posterUrl && (
                  <div className="w-20 h-28 rounded-xl border border-border overflow-hidden shrink-0 bg-muted">
                    <img
                      src={state.posterUrl}
                      alt="Poster preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "cast":
        return (
          <div className="space-y-5">
            <div>
              <h2
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Cast & Crew
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Search and add cast members to your content
              </p>
            </div>
            <CastSearch
              cast={state.cast}
              onChange={(v) => dispatch({ kind: "SET_CAST", payload: v })}
            />
          </div>
        );

      case "seasons":
        return (
          <div className="space-y-5">
            <div>
              <h2
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Season & Episode Structure
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Define seasons, episodes, and their details
              </p>
            </div>
            <SeasonManager
              seasons={state.seasons}
              onChange={(v) => dispatch({ kind: "SET_SEASONS", payload: v })}
            />
          </div>
        );

      case "media":
        return (
          <div className="space-y-5">
            <div>
              <h2
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Upload Media
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload video files, posters, and thumbnails
              </p>
            </div>
            <MediaUploadZone />
          </div>
        );

      default:
        return null;
    }
  };

  /* ── Render ──────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Upload Content
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Add movies, series, or specials to the platform
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {steps.map((step, i) => {
          const isActive = i === stepIdx;
          const isDone = i < stepIdx;
          return (
            <div key={step.key} className="flex items-center">
              {i > 0 && (
                <div className={cn("h-px w-6 sm:w-10 mx-1", isDone ? "bg-primary" : "bg-border")} />
              )}
              <button
                type="button"
                onClick={() => {
                  if (isDone) setStepIdx(i);
                }}
                disabled={!isDone && !isActive}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer",
                  "transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : isDone
                      ? "text-foreground hover:bg-muted/50 border border-transparent"
                      : "text-muted-foreground border border-transparent cursor-default",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Step content card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 min-h-[360px]">
        {renderStepContent()}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIdx === 0}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer",
            "border border-border hover:bg-muted/50 transition-colors",
            stepIdx === 0 && "opacity-40 cursor-not-allowed",
          )}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveDraft}
            disabled={!state.type}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer",
              "border border-border hover:bg-muted/50 transition-colors",
              !state.type && "opacity-40 cursor-not-allowed",
            )}
          >
            <Save className="h-4 w-4" /> Save Draft
          </button>

          {stepIdx < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext()}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                !canNext() && "opacity-50 cursor-not-allowed",
              )}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={saveDraft}
              disabled={!state.type}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                !state.type && "opacity-50 cursor-not-allowed",
              )}
            >
              Save & Finish <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
