import { cn } from "@/lib/utils/cn";

type StatusBadgeProps = {
  status: "ongoing" | "completed" | "paused" | "draft";
};

type BadgeStyle = {
  background: string;
  color: string;
  border: string;
};

const stylesByStatus: Record<StatusBadgeProps["status"], BadgeStyle> = {
  ongoing: {
    background: "#00ff8815",
    color: "#00ff88",
    border: "0.5px solid #00ff8833",
  },
  completed: {
    background: "#6b728015",
    color: "#6b7280",
    border: "0.5px solid #6b728033",
  },
  paused: {
    background: "#6b728015",
    color: "#6b7280",
    border: "0.5px solid #6b728033",
  },
  draft: {
    background: "#1e1e1e",
    color: "#6b7280",
    border: "0.5px solid #1e1e1e",
  },
};

export function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element {
  const s = stylesByStatus[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase",
      )}
      style={{ background: s.background, color: s.color, border: s.border }}
    >
      {status}
    </span>
  );
}
