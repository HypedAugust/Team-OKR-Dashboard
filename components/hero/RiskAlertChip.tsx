import { AlertTriangle } from 'lucide-react';
import { krDisplayStatus } from '@/lib/calc';
import type { KR, Member } from '@/lib/types';

export function RiskAlertChip({
  krs,
  members,
}: {
  krs: KR[];
  members: Member[];
}) {
  const risky = krs.filter((kr) => krDisplayStatus(kr) === 'risk');
  if (risky.length === 0) return null;

  const ownerIds = Array.from(new Set(risky.flatMap((k) => k.owners)));
  const ownerNames = ownerIds
    .map((id) => members.find((m) => m.id === id)?.name ?? id)
    .slice(0, 3);

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-danger-soft text-status-danger">
      <AlertTriangle size={14} strokeWidth={2.75} />
      <span className="text-label-sm">위험 KR {risky.length}건</span>
      {ownerNames.length > 0 && (
        <span className="text-caption opacity-80">· {ownerNames.join(' · ')}</span>
      )}
    </span>
  );
}
