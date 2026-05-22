import { AlertTriangle, Check } from 'lucide-react';
import type { KRDisplayStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: KRDisplayStatus }) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-status-success-soft text-status-success text-label-sm">
        <Check size={14} strokeWidth={3} />
        달성 완료
      </span>
    );
  }
  if (status === 'risk') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-status-danger-soft text-status-danger text-label-sm">
        <AlertTriangle size={14} strokeWidth={3} />
        위험
      </span>
    );
  }
  return null;
}
