import { Toaster, toast } from "sonner";

/**
 * Pre-configured Toaster for the app.
 * Drop this into the root layout / providers.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        style: {
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "12px",
        },
      }}
    />
  );
}

// Re-export toast for convenient usage
export { toast };
