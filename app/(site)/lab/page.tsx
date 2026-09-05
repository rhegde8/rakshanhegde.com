import { ExperimentCard } from "@/components/lab/ExperimentCard";
import { SectionHeading } from "@/components/SectionHeading";
import { experiments } from "@/lib/lab/experiments";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "The Lab",
  description:
    "Playable AI experiments — a prompt-injection jailbreak game, a gradient-descent arcade, and a live sampling demo. All run entirely in your browser.",
  path: "/lab",
});

export default function LabPage(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="the lab"
        subtitle="Interactive AI experiments you can actually play. No sign-up, no API keys — every adversary and every optimizer runs client-side, right here in your browser."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {experiments.map((experiment) => (
          <ExperimentCard key={experiment.slug} experiment={experiment} />
        ))}
      </div>

      <p className="surface-panel border-l-amber text-muted border-l-2 p-4 font-mono text-xs">
        {"// "}each of these is a teaching tool in disguise. BREACH walks you through the real
        taxonomy of prompt-injection attacks; DESCENT gives you a physical feel for the
        hyperparameters that make or break training. Have fun. Break things.
      </p>
    </div>
  );
}
