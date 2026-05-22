import { QuarterSelector } from './QuarterSelector';
import { ActionButtons } from './ActionButtons';
import type { Member, Quarter } from '@/lib/types';

export function GlobalHeader({
  current,
  quarters,
  members,
  isReadOnly,
}: {
  current: Quarter | null;
  quarters: Quarter[];
  members: Member[];
  isReadOnly: boolean;
}) {
  return (
    <header className="flex items-center justify-between gap-6 px-8 py-5 border-b border-border-subtle bg-bg-base sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-heading-md">
          <span className="w-7 h-7 rounded-md bg-status-success/20 grid place-items-center text-status-success font-bold">
            O
          </span>
          <span className="text-text-primary">사업전략팀 OKR</span>
        </div>
        <div className="no-print">
          <QuarterSelector current={current} quarters={quarters} />
        </div>
        {isReadOnly && (
          <span className="no-print px-2 py-1 rounded-sm bg-bg-surface3 text-text-tertiary text-label-sm">
            읽기 전용
          </span>
        )}
      </div>
      <div className="no-print">
        <ActionButtons members={members} disabled={isReadOnly} />
      </div>
    </header>
  );
}
