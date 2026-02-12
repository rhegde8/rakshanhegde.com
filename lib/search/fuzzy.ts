function normalize(value: string): string {
  return value.toLowerCase().trim();
}

export function fuzzyScore(query: string, target: string): number {
  const q = normalize(query);
  const t = normalize(target);

  if (!q) {
    return 0;
  }

  if (!t) {
    return -1;
  }

  if (t.includes(q)) {
    const densityBonus = Math.max(0, 120 - (t.length - q.length));
    return 1_000 + densityBonus;
  }

  let queryIndex = 0;
  let score = 0;
  let streak = 0;

  for (let i = 0; i < t.length && queryIndex < q.length; i += 1) {
    if (t[i] === q[queryIndex]) {
      queryIndex += 1;
      streak += 1;
      score += 4 + streak * 2;
    } else {
      streak = 0;
    }
  }

  if (queryIndex !== q.length) {
    return -1;
  }

  return score - (t.length - q.length);
}

export function filterByFuzzySearch<T>(
  items: readonly T[],
  query: string,
  selector: (item: T) => readonly string[],
): T[] {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [...items];
  }

  return items
    .map((item) => {
      const score = selector(item).reduce((best, field) => {
        const fieldScore = fuzzyScore(normalizedQuery, field);
        return Math.max(best, fieldScore);
      }, -1);

      return { item, score };
    })
    .filter((result) => result.score >= 0)
    .sort((left, right) => right.score - left.score)
    .map((result) => result.item);
}
