import type { ReactNode } from "react";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-2.5 py-4 sm:px-4 sm:py-6 md:px-6 md:py-10">{children}</main>
      <Footer />
    </div>
  );
}
