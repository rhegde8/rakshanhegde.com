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
      <h2 className="text-accent-1 font-mono text-2xl font-semibold sm:text-3xl">{title}</h2>
      {subtitle ? <p className="text-muted max-w-3xl text-sm sm:text-base">{subtitle}</p> : null}
    </header>
  );
}
