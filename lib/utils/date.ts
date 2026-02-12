export function formatDate(dateValue: string): string {
  const parsed = new Date(dateValue);

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(parsed);
}
