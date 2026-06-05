import { Logo } from '@/components/ui/Logo';
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
    <header className="flex items-center justify-between gap-6 px-8 py-5 border-b border-border-default bg-bg-surface1/95 backdrop-blur-md sticky top-0 z-40 shadow-[0_1px_0_0_rgba(255,255,255,0.04),0_4px_16px_-4px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-5">
        <Logo height={36} />
        <span className="hidden md:inline text-heading-md text-text-secondary">
          사업전략본부 OKR
        </span>
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
        <ActionButtons
          members={members}
          disabled={isReadOnly}
          quarterName={current?.name}
        />
      </div>
    </header>
  );
}
