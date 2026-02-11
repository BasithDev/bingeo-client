import toast, { Toaster, type ToastOptions } from "react-hot-toast";

/**
 * Pre-configured Toaster component for the app.
 * Drop this into the root layout / providers.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#fff",
          },
          style: {
            border: "1px solid #D1FAE5",
            background: "#F0FDF4",
            color: "#166534",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#fff",
          },
          style: {
            border: "1px solid #FEE2E2",
            background: "#FEF2F2",
            color: "#991B1B",
          },
        },
      }}
    />
  );
}

// Re-export toast for convenient usage
export { toast, type ToastOptions };
