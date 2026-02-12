import { cn } from "@/lib/utils/cn";

type StatusBadgeProps = {
  status: "ongoing" | "completed" | "paused" | "draft";
};

const stylesByStatus: Record<StatusBadgeProps["status"], string> = {
  completed: "border-success/40 bg-success/15 text-success",
  ongoing: "border-accent-1/40 bg-accent-1/15 text-accent-1",
  paused: "border-warning/40 bg-warning/15 text-warning",
  draft: "border-muted/40 bg-muted/10 text-muted",
};

export function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase",
        stylesByStatus[status],
      )}
    >
      {status}
    </span>
  );
}
