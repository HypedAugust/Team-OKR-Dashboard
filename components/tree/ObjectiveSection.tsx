'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import {
  createKR,
  deleteObjective,
  updateObjective,
} from '@/app/actions';
import { KRCard } from './KRCard';
import { ConfirmDialog } from '@/components/modal/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import {
  avgProgress,
  doneCount,
  formatPercent,
  progressColor,
} from '@/lib/calc';
import type { KR, Member, Objective } from '@/lib/types';

const dotColor = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  idle: 'bg-status-idle',
} as const;

export function ObjectiveSection({
  qid,
  objective,
  krs,
  members,
  readOnly,
}: {
  qid: string;
  objective: Objective;
  krs: KR[];
  members: Member[];
  readOnly: boolean;
}) {
  const hasUpdate = krs.some((k) => k.updated_at !== null);
  const avg = avgProgress(krs);
  const color = progressColor(avg, hasUpdate);
  const { done, total } = doneCount(krs);

  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(objective.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function saveTitle() {
    startTransition(async () => {
      const r = await updateObjective(qid, objective.id, { title });
      if (!r.ok) toast.show(r.error, 'error');
      setEditingTitle(false);
    });
  }

  function addKR() {
    startTransition(async () => {
      const r = await createKR(qid, objective.id);
      if (!r.ok) toast.show(r.error, 'error');
    });
  }

  return (
    <section className="objective-section mb-10">
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="text-label-sm text-text-muted num">{objective.id}</span>
        {editingTitle && !readOnly ? (
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              if (e.key === 'Escape') {
                setTitle(objective.title);
                setEditingTitle(false);
              }
            }}
            className="flex-1 px-3 py-1 bg-bg-surface2 border border-border-default rounded-md text-heading-lg text-text-primary focus:outline-none focus:border-border-strong"
          />
        ) : (
          <h2
            className={`text-heading-lg text-text-primary ${
              readOnly ? '' : 'cursor-text hover:text-text-secondary'
            }`}
            onClick={() => !readOnly && setEditingTitle(true)}
          >
            {objective.title || (
              <span className="text-text-muted">제목을 입력하세요</span>
            )}
          </h2>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dotColor[color]}`} />
            <span className="text-body-md text-text-secondary num">
              평균 {formatPercent(avg)}
            </span>
            <span className="text-body-sm text-text-tertiary num">
              · 달성 {done}/{total}
            </span>
          </div>
          {!readOnly && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="no-print delete-button text-text-muted hover:text-status-danger transition-colors"
              aria-label="Objective 삭제"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        {krs.map((kr) => (
          <KRCard
            key={kr.id}
            qid={qid}
            oid={objective.id}
            kr={kr}
            members={members}
            readOnly={readOnly}
          />
        ))}
        {!readOnly && (
          <button
            onClick={addKR}
            disabled={pending}
            className="no-print add-button kr-card min-h-[200px] rounded-xl border-2 border-dashed border-border-default hover:border-border-strong text-text-tertiary hover:text-text-secondary flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span className="text-body-md">KR 추가</span>
          </button>
        )}
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Objective 삭제"
          description={`'${objective.title || objective.id}'와 산하 모든 KR이 삭제됩니다. 진행할까요?`}
          confirmLabel="삭제"
          variant="danger"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            await deleteObjective(qid, objective.id);
            setConfirmDelete(false);
          }}
        />
      )}
    </section>
  );
}
