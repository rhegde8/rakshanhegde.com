import Link from "next/link";

import { BreachGame } from "@/components/lab/BreachGame";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "BREACH — jailbreak the model",
  description:
    "A browser-only prompt-injection game. Talk your way past five layers of AI guardrails — override, role-play, encoding, prompt-leak, and indirect injection. Real techniques, zero risk.",
  path: "/lab/breach",
});

export default function BreachPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link href="/lab" className="text-accent font-mono text-xs hover:underline">
          ← back to the lab
        </Link>
        <h1 className="font-display text-text text-3xl font-semibold tracking-tight sm:text-4xl">
          BREACH
        </h1>
        <p className="text-muted max-w-2xl text-sm sm:text-base">
          Five AI assistants. Five secrets. Each one is hardened against the trick that beat the
          last. Your job is to jailbreak all of them — using the same prompt-injection techniques
          that keep AI security engineers employed. It&apos;s a toy adversary running entirely in
          your browser, but the attacks are the genuine article.
        </p>
      </div>

      <BreachGame />
    </div>
  );
}
