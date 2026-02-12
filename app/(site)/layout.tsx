import type { ReactNode } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): React.JSX.Element {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[calc(100vh-13rem)] w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
