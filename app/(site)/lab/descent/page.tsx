import Link from "next/link";

import { DescentGame } from "@/components/lab/DescentGame";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "DESCENT — gradient descent by hand",
  description:
    "You are the optimizer. Tune learning rate and momentum to roll a parameter into the global minimum of a loss landscape before you run out of steps. Three landscapes, canvas-rendered, in your browser.",
  path: "/lab/descent",
});

export default function DescentPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link href="/lab" className="text-accent font-mono text-xs hover:underline">
          ← back to the lab
        </Link>
        <h1 className="font-display text-text text-3xl font-semibold tracking-tight sm:text-4xl">
          DESCENT
        </h1>
        <p className="text-muted max-w-2xl text-sm sm:text-base">
          Every neural network is trained by rolling downhill on a loss landscape. Here,{" "}
          <span className="text-text">you</span> are the optimizer. Pick a learning rate and a
          momentum, then guide the parameter into the global minimum before your step budget runs
          out. Too aggressive and you diverge; too timid and you get trapped. Three landscapes, each
          crueler than the last.
        </p>
      </div>

      <DescentGame />
    </div>
  );
}
