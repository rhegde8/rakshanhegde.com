import { cn } from "@/lib/utils/cn";

type TagPillProps = {
  label: string;
  className?: string;
};

export function TagPill({ label, className }: TagPillProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-[#1e1e1e] bg-[#222222] px-2 py-0.5 font-mono text-[10px] text-[#6b7280]",
        className,
      )}
    >
      {label}
    </span>
  );
}
