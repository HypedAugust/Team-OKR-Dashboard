import { AlertTriangle, Check } from 'lucide-react';
import type { KRDisplayStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: KRDisplayStatus }) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-status-success-soft text-status-success text-label-sm">
        <Check size={12} strokeWidth={2.5} />
        달성 완료
      </span>
    );
  }
  if (status === 'risk') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-status-danger-soft text-status-danger text-label-sm">
        <AlertTriangle size={12} strokeWidth={2.5} />
        위험
      </span>
    );
  }
  return null;
}
