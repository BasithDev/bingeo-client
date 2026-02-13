import { Upload } from "lucide-react";

export function MediaUploadZone() {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Media Upload
      </label>
      <div className="rounded-xl border-2 border-dashed border-border bg-muted/10 py-16 flex flex-col items-center justify-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            Upload will be available soon
          </p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Media upload functionality will be enabled after backend integration
            is complete. Save as draft and come back to upload later.
          </p>
        </div>
        <button
          type="button"
          disabled
          className="mt-2 px-5 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed opacity-60"
        >
          Choose Files
        </button>
      </div>
    </div>
  );
}
