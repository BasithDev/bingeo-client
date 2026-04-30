import { CheckCircle, CloudUpload, Image as ImageIcon, Upload, X, AlertCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/utils/cn";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp";
const MAX_FILE_SIZE_MB = 10; // 10 MB

export type UploadState = "idle" | "uploading" | "success" | "error";

interface ThumbnailUploadZoneProps {
  contentId: string;
  existingThumbnailKey?: string;
  onUploadComplete: (thumbnailKey: string) => void;
  requestUploadUrl: (
    contentId: string,
    fileName: string,
    contentType: string,
  ) => Promise<{ uploadUrl: string; key: string }>;
  confirmUpload: (contentId: string, thumbnailKey: string) => Promise<unknown>;
}

export function ThumbnailUploadZone({
  contentId,
  existingThumbnailKey,
  onUploadComplete,
  requestUploadUrl,
  confirmUpload,
}: ThumbnailUploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const validateFile = useCallback((f: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(f.type) && !f.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return `Unsupported format. Accepted: JPG, PNG, WebP`;
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File too large. Max ${MAX_FILE_SIZE_MB} MB`;
    }
    return null;
  }, []);

  const handleFileSelect = useCallback(
    (f: File) => {
      const err = validateFile(f);
      if (err) {
        setErrorMsg(err);
        setUploadState("error");
        return;
      }
      setFile(f);
      setUploadState("idle");
      setErrorMsg("");
      setProgress(0);
    },
    [validateFile],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  };

  const startUpload = async () => {
    if (!file) return;

    setUploadState("uploading");
    setProgress(0);
    setErrorMsg("");

    try {
      const { uploadUrl, key } = await requestUploadUrl(
        contentId,
        file.name,
        file.type || "image/jpeg",
      );

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type || "image/jpeg");
        xhr.send(file);
      });

      await confirmUpload(contentId, key);

      setUploadState("success");
      setProgress(100);
      onUploadComplete(key);
    } catch (err) {
      if ((err as Error).message !== "Upload cancelled") {
        setUploadState("error");
        setErrorMsg((err as Error).message || "Upload failed");
      }
    } finally {
      xhrRef.current = null;
    }
  };

  const cancelUpload = () => {
    xhrRef.current?.abort();
    xhrRef.current = null;
    setUploadState("idle");
    setProgress(0);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadState("idle");
    setProgress(0);
    setErrorMsg("");
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
    if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium text-foreground block mb-2">Thumbnail Upload</legend>

      {/* Already uploaded (loaded from DB) */}
      {existingThumbnailKey && !file && uploadState !== "success" && uploadState !== "uploading" && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/4 p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Thumbnail uploaded</p>
              <p className="text-xs text-muted-foreground truncate">
                <a href={`https://bingeo-media-assets.s3.ap-south-1.amazonaws.com/${existingThumbnailKey}`} target="_blank" rel="noreferrer" className="hover:underline">
                  View image
                </a>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setUploadState("idle");
                setProgress(0);
                setErrorMsg("");
                onUploadComplete("");
              }}
              className="text-xs text-primary hover:underline whitespace-nowrap"
            >
              Replace
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!file && !existingThumbnailKey && uploadState !== "success" && (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
          className={cn(
            "rounded-2xl border-2 border-dashed py-14 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200",
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border bg-muted/10 hover:border-primary/50 hover:bg-primary/2",
          )}
        >
          <div className={cn(
            "h-16 w-16 rounded-2xl flex items-center justify-center transition-colors",
            dragOver ? "bg-primary/10" : "bg-muted/50",
          )}>
            <CloudUpload className={cn("h-7 w-7", dragOver ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground">
              {dragOver ? "Drop your image here" : "Drag & drop your thumbnail image"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP — up to {MAX_FILE_SIZE_MB} MB
            </p>
          </div>
          <button
            type="button"
            className="mt-1 px-5 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            Choose File
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={onInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* File selected — ready to upload */}
      {file && uploadState === "idle" && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
            </div>
            <button type="button" onClick={resetUpload} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <button
            type="button"
            onClick={startUpload}
            className="w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Start Upload
          </button>
        </div>
      )}

      {/* Uploading — progress */}
      {uploadState === "uploading" && file && (
        <div className="rounded-2xl border border-primary/30 bg-primary/2 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
            </div>
            <button
              type="button"
              onClick={cancelUpload}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title="Cancel upload"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            {formatSize(file.size * (progress / 100))} / {formatSize(file.size)}
          </p>
        </div>
      )}

      {/* Success */}
      {uploadState === "success" && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/4 p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Upload complete!</p>
              <p className="text-xs text-muted-foreground">{file?.name} — {file ? formatSize(file.size) : ""}</p>
            </div>
            <button type="button" onClick={resetUpload} className="text-xs text-primary hover:underline">
              Replace
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {uploadState === "error" && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/4 p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Upload failed</p>
              <p className="text-xs text-red-400">{errorMsg}</p>
            </div>
            <button type="button" onClick={resetUpload} className="text-xs text-primary hover:underline">
              Try again
            </button>
          </div>
        </div>
      )}
    </fieldset>
  );
}
