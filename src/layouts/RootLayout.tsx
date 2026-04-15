import type { ReactNode } from "react";
import { NavBar } from "../components/NavBar";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
