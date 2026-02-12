import { cn } from "@/lib/utils/cn";

type TagPillProps = {
  label: string;
  className?: string;
};

export function TagPill({ label, className }: TagPillProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "border-border bg-panel/80 text-muted inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px]",
        className,
      )}
    >
      {label}
    </span>
  );
}
