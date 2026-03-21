import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  className,
}: SectionHeadingProps): React.JSX.Element {
  return (
    <header className={cn("mb-6 space-y-2", className)}>
      <h2 className="font-mono text-sm font-medium tracking-widest text-[#00ff88]">
        {"// "}
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-3xl text-sm text-[#6b7280] sm:text-base">{subtitle}</p>
      ) : null}
    </header>
  );
}
