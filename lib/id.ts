export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function nextSerialId(existing: string[], prefix: string): string {
  const re = new RegExp(`^${prefix}(\\d+)$`);
  const max = existing.reduce((m, id) => {
    const match = re.exec(id);
    if (match) return Math.max(m, parseInt(match[1], 10));
    return m;
  }, 0);
  return `${prefix}${max + 1}`;
}

export function nextKRId(existingKrIds: string[], objectiveId: string): string {
  return nextSerialId(existingKrIds, `${objectiveId}-KR`);
}
