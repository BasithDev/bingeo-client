import { Outlet } from "@tanstack/react-router";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
