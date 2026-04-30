import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Film, Save, Sparkles, Tv } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/utils/cn";
import { CastSearch } from "../components/content/CastSearch";
import { GenrePicker } from "../components/content/GenrePicker";
import { MediaUploadZone } from "../components/content/MediaUploadZone";
import { ThumbnailUploadZone } from "../components/content/ThumbnailUploadZone";
import { SeasonManager } from "../components/content/SeasonManager";
import type { ICastMember, IContentMetadata, ContentType, ISeason } from "../types/content.types";
import { contentService } from "@/services/api";

interface IStepDef {
  key: string;
  label: string;
  description: string;
}

const ALL_STEPS: IStepDef[] = [
  { key: "type", label: "Type", description: "Choose content type" },
  { key: "details", label: "Details", description: "Metadata & info" },
  { key: "cast", label: "Cast", description: "Search & add cast" },
  { key: "seasons", label: "Seasons", description: "Episodes & seasons" },
  { key: "media", label: "Media", description: "Upload content" },
];

function getSteps(contentType: ContentType | null): IStepDef[] {
  if (contentType !== "series") {
    return ALL_STEPS.filter((s) => s.key !== "seasons");
  }
  return ALL_STEPS;
}

interface IFormState {
  type: ContentType | null;
  title: string;
  plot: string;
  duration: string;
  posterUrl: string;
  thumbnailKey: string;
  genres: string[];
  cast: ICastMember[];
  seasons: ISeason[];
  videoKey: string;
}

type Action =
  | { kind: "SET_TYPE"; payload: ContentType }
  | { kind: "SET_FIELD"; field: "title" | "plot" | "duration" | "posterUrl" | "thumbnailKey" | "videoKey"; value: string }
  | { kind: "SET_GENRES"; payload: string[] }
  | { kind: "SET_CAST"; payload: ICastMember[] }
  | { kind: "SET_SEASONS"; payload: ISeason[] }
  | { kind: "LOAD_DRAFT"; payload: IFormState };

function reducer(state: IFormState, action: Action): IFormState {
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

const INITIAL: IFormState = {
  type: null,
  title: "",
  plot: "",
  duration: "",
  posterUrl: "",
  genres: [],
  cast: [],
  seasons: [],
  thumbnailKey: "",
  videoKey: "",
};

export function ContentUploadPage() {
  const navigate = useNavigate();
  const { draft: draftId } = useSearch({ strict: false }) as { draft?: string };
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [stepIdx, setStepIdx] = useState(0);
  const editingIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!draftId) return;
    (async () => {
      try {
        const f = await contentService.getDraft(draftId);
        editingIdRef.current = f.id;
        dispatch({
          kind: "LOAD_DRAFT",
          payload: {
            type: f.type,
            title: f.title,
            plot: f.plot,
            duration: f.duration,
            posterUrl: f.posterUrl || "",
            genres: f.genres,
            cast: f.cast || [],
            seasons: f.seasons || [],
            thumbnailKey: f.thumbnailKey || "",
            videoKey: f.videoKey || "",
          },
        });
        setStepIdx(1);
      } catch {
      }
    })();
  }, [draftId]);

  const steps = getSteps(state.type);
  const currentStep = steps[stepIdx];

  const canNext = useCallback(() => {
    if (!currentStep) return false;
    if (currentStep.key === "type") return state.type !== null;
    if (currentStep.key === "details") return state.title.trim().length > 0;
    return true;
  }, [currentStep, state.type, state.title]);

  const queryClient = useQueryClient();

  const ensureSaved = async (): Promise<string> => {
    const now = new Date().toISOString();
    const id = editingIdRef.current ?? `draft-${Date.now()}`;
    editingIdRef.current = id;

    const data: IContentMetadata = {
      id,
      status: "draft",
      createdAt: now,
      title: state.title || "Untitled",
      type: state.type ?? "movie",
      genres: state.genres,
      plot: state.plot,
      duration: state.duration,
      posterUrl: state.posterUrl || undefined,
      thumbnailKey: state.thumbnailKey || undefined,
      videoKey: state.videoKey || undefined,
      cast: state.cast,
      seasons: state.seasons,
      updatedAt: now,
    };

    await contentService.saveDraft(data);
    return id;
  };

  const saveDraft = async () => {
    await ensureSaved();
    await queryClient.invalidateQueries({ queryKey: ["content", "drafts"] });
    navigate({ to: "/admin/content/drafts" });
  };

  const handleUploadComplete = (videoKey: string) => {
    dispatch({ kind: "SET_FIELD", field: "videoKey", value: videoKey });
  };

  const handleRequestUploadUrl = async (
    _contentId: string,
    fileName: string,
    contentType: string,
  ) => {
    const id = await ensureSaved();
    return contentService.requestUploadUrl(id, fileName, contentType);
  };

  const handleConfirmUpload = async (_contentId: string, videoKey: string) => {
    const id = editingIdRef.current!;
    return contentService.confirmUpload(id, videoKey);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Upload Content
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Add movies, series, or specials</p>
      </header>

      <StepIndicator steps={steps} currentIdx={stepIdx} onStepClick={setStepIdx} />

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 min-h-[360px]">
        {currentStep?.key === "type" && <TypeStep state={state} dispatch={dispatch} />}
        {currentStep?.key === "details" && <DetailsStep state={state} dispatch={dispatch} />}
        {currentStep?.key === "cast" && <CastStep state={state} dispatch={dispatch} />}
        {currentStep?.key === "seasons" && <SeasonsStep state={state} dispatch={dispatch} />}
        {currentStep?.key === "media" && (
          <MediaStep
            state={state}
            dispatch={dispatch}
            contentId={editingIdRef.current ?? ""}
            onUploadComplete={handleUploadComplete}
            requestUploadUrl={handleRequestUploadUrl}
            confirmUpload={handleConfirmUpload}
            ensureSaved={ensureSaved}
            editingIdRef={editingIdRef}
          />
        )}
      </div>

      <Footer
        stepIdx={stepIdx}
        total={steps.length}
        canNext={canNext()}
        onBack={() => setStepIdx((s) => s - 1)}
        onNext={() => setStepIdx((s) => s + 1)}
        onSave={saveDraft}
      />
    </div>
  );
}

function StepIndicator({
  steps,
  currentIdx,
  onStepClick,
}: {
  steps: IStepDef[];
  currentIdx: number;
  onStepClick: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center">
          {i > 0 && (
            <div
              className={cn("h-px w-6 sm:w-10 mx-1", i <= currentIdx ? "bg-primary" : "bg-border")}
            />
          )}
          <button
            type="button"
            onClick={() => onStepClick(i)}
            disabled={i > currentIdx}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
              i === currentIdx
                ? "bg-primary/10 text-primary border border-primary/30"
                : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                i <= currentIdx ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {i < currentIdx ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

function TypeStep({ state, dispatch }: { state: IFormState; dispatch: React.Dispatch<Action> }) {
  const options: { value: ContentType; label: string; Icon: React.ElementType; desc: string }[] = [
    { value: "movie", label: "Movie", Icon: Film, desc: "Feature film" },
    { value: "series", label: "Series", Icon: Tv, desc: "Episodic show" },
    { value: "special", label: "Special", Icon: Sparkles, desc: "One-off event" },
  ];
  return (
    <div className="py-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">What are you uploading?</h2>
        <p className="text-sm text-muted-foreground">Select the content type to get started</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => dispatch({ kind: "SET_TYPE", payload: o.value })}
            className={cn(
              "p-6 rounded-2xl border-2 text-left transition-all",
              state.type === o.value ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            <o.Icon className="h-8 w-8 mb-4 text-primary" />
            <p className="font-bold">{o.label}</p>
            <p className="text-xs text-muted-foreground">{o.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailsStep({ state, dispatch }: { state: IFormState; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <Input
        id="content-title"
        label="Content Title *"
        placeholder="e.g. Inception"
        value={state.title}
        onChange={(e) => dispatch({ kind: "SET_FIELD", field: "title", value: e.target.value })}
      />
      <div className="space-y-1.5">
        <Textarea
          id="content-plot"
          label="Plot Summary"
          placeholder="A brief description of the story..."
          rows={4}
          value={state.plot}
          onChange={(e) => dispatch({ kind: "SET_FIELD", field: "plot", value: e.target.value })}
        />
      </div>
      <GenrePicker
        selected={state.genres}
        onChange={(g) => dispatch({ kind: "SET_GENRES", payload: g })}
      />
    </div>
  );
}

function CastStep({ state, dispatch }: { state: IFormState; dispatch: React.Dispatch<Action> }) {
  return (
    <CastSearch cast={state.cast} onChange={(v) => dispatch({ kind: "SET_CAST", payload: v })} />
  );
}

function SeasonsStep({ state, dispatch }: { state: IFormState; dispatch: React.Dispatch<Action> }) {
  return (
    <SeasonManager
      seasons={state.seasons}
      onChange={(v) => dispatch({ kind: "SET_SEASONS", payload: v })}
    />
  );
}

interface MediaStepProps {
  state: IFormState;
  dispatch: React.Dispatch<Action>;
  contentId: string;
  onUploadComplete: (videoKey: string) => void;
  requestUploadUrl: (
    contentId: string,
    fileName: string,
    contentType: string,
  ) => Promise<{ uploadUrl: string; key: string }>;
  confirmUpload: (contentId: string, videoKey: string) => Promise<unknown>;
  ensureSaved: () => Promise<string>;
  editingIdRef: React.MutableRefObject<string | null>;
}

function MediaStep({
  state,
  dispatch,
  contentId,
  onUploadComplete,
  requestUploadUrl,
  confirmUpload,
  ensureSaved,
  editingIdRef,
}: MediaStepProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <ThumbnailUploadZone
        contentId={contentId}
        existingThumbnailKey={state.thumbnailKey || undefined}
        onUploadComplete={(key) => dispatch({ kind: "SET_FIELD", field: "thumbnailKey", value: key })}
        requestUploadUrl={async (cId, fName, cType) => {
          const id = await ensureSaved();
          return contentService.requestThumbnailUrl(id, fName, cType);
        }}
        confirmUpload={async (cId, key) => {
          const id = editingIdRef.current!;
          return contentService.confirmThumbnail(id, key);
        }}
      />
      <MediaUploadZone
        contentId={contentId}
        existingVideoKey={state.videoKey || undefined}
        onUploadComplete={onUploadComplete}
        requestUploadUrl={requestUploadUrl}
        confirmUpload={confirmUpload}
      />
    </div>
  );
}

interface FooterProps {
  stepIdx: number;
  total: number;
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onSave: () => void;
}

function Footer({ stepIdx, total, canNext, onBack, onNext, onSave }: FooterProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      <button
        type="button"
        onClick={onBack}
        disabled={stepIdx === 0}
        className="px-4 py-2 rounded-xl text-sm border hover:bg-muted disabled:opacity-0"
      >
        <ChevronLeft className="h-4 w-4 inline mr-1" />
        Back
      </button>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 rounded-xl text-sm border hover:bg-muted"
        >
          <Save className="h-4 w-4 inline mr-1" />
          Save Draft
        </button>
        {stepIdx < total - 1 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className="px-6 py-2 rounded-xl text-sm bg-primary text-primary-foreground disabled:opacity-50"
          >
            Next <ChevronRight className="h-4 w-4 inline ml-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-2 rounded-xl text-sm bg-primary text-primary-foreground"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}
