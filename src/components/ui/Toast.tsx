import { Toaster, toast } from "sonner";

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

export { toast };
