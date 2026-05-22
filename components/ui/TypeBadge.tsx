import type { KRType } from '@/lib/types';

export function TypeBadge({ type }: { type: KRType }) {
  if (type === 'Commit') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-type-commit bg-type-commit-soft text-type-commit text-label-sm">
        Commit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-type-aspire bg-type-aspire-soft text-type-aspire text-label-sm">
      Aspire
    </span>
  );
}
