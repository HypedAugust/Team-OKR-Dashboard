'use client';

import { Plus } from 'lucide-react';
import { useTransition } from 'react';
import { createObjective } from '@/app/actions';
import { ObjectiveSection } from './ObjectiveSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useToast } from '@/components/ui/Toast';
import type { KR, Member, Objective } from '@/lib/types';

export function OKRTree({
  qid,
  objectives,
  members,
  readOnly,
}: {
  qid: string;
  objectives: Array<Objective & { krs: KR[] }>;
  members: Member[];
  readOnly: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function addObjective() {
    startTransition(async () => {
      const r = await createObjective(qid, '새 Objective');
      if (!r.ok) toast.show(r.error, 'error');
    });
  }

  return (
    <div className="px-8 pt-12">
      <SectionHeader
        number="02"
        title="OKR 진행 현황"
        description="Objective와 Key Result 단위 상세"
      />
      {objectives.map((o, i) => (
        <ObjectiveSection
          key={o.id}
          qid={qid}
          objective={o}
          krs={o.krs}
          members={members}
          readOnly={readOnly}
          index={i + 1}
        />
      ))}
      {!readOnly && (
        <button
          onClick={addObjective}
          disabled={pending}
          className="no-print add-button w-full py-8 mb-10 rounded-xl border-2 border-dashed border-border-default hover:border-border-strong text-text-tertiary hover:text-text-secondary flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span className="text-body-md">Objective 추가</span>
        </button>
      )}
    </div>
  );
}
