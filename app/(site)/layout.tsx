import type { ReactNode } from "react";

import { CommandPalette } from "@/components/CommandPalette";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildPaletteItems } from "@/lib/config/palette";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<React.JSX.Element> {
  const paletteItems = await buildPaletteItems();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[calc(100vh-13rem)] w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {children}
      </main>
      <SiteFooter />
      <CommandPalette items={paletteItems} />
    </>
  );
}
