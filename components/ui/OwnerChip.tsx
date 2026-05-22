import { User } from 'lucide-react';

export function OwnerChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-surface3 text-text-secondary text-body-sm">
      <User size={12} className="text-text-tertiary" />
      {name}
    </span>
  );
}
