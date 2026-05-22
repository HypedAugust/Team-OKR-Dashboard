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
import { ProgressCircle } from '@/components/ui/ProgressCircle';
import { useToast } from '@/components/ui/Toast';
import {
  avgProgress,
  doneCount,
  progressColor,
} from '@/lib/calc';
import type { KR, Member, Objective } from '@/lib/types';

const accentBg = {
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
  index,
}: {
  qid: string;
  objective: Objective;
  krs: KR[];
  members: Member[];
  readOnly: boolean;
  index: number;
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
      {/* Objective 헤더 — 강조 카드 */}
      <div className="bg-bg-surface1 rounded-2xl border border-border-subtle p-6 mb-5 flex items-center gap-6">
        {/* 좌측: 큰 라벨 + 제목 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-1.5 h-5 rounded-full ${accentBg[color]}`} />
            <span className="text-label-md text-text-tertiary uppercase num">
              Objective {index} · {objective.id}
            </span>
          </div>
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
              className="w-full px-3 py-2 bg-bg-surface2 border border-border-default rounded-lg text-heading-lg text-text-primary focus:outline-none focus:border-border-strong"
            />
          ) : (
            <h2
              className={`text-heading-lg text-text-primary leading-tight ${
                readOnly ? '' : 'cursor-text hover:text-text-secondary'
              }`}
              onClick={() => !readOnly && setEditingTitle(true)}
            >
              {objective.title || (
                <span className="text-text-muted">제목을 입력하세요</span>
              )}
            </h2>
          )}
        </div>

        {/* 우측: 미니 게이지 + 카운트 + 삭제 */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-caption text-text-tertiary">달성</span>
            <span className="text-heading-lg text-text-primary num">
              {done}<span className="text-text-tertiary">/{total}</span>
            </span>
          </div>
          {/* 화면용 도넛 — print에선 깨지므로 숨김 */}
          <div className="print:hidden">
            <ProgressCircle value={avg} color={color} size={56} strokeWidth={6} />
          </div>
          {/* PDF용 — 단순 % 텍스트만 */}
          <div className="hidden print:flex flex-col items-end">
            <span className="text-caption text-text-tertiary">평균</span>
            <span className="text-heading-lg text-text-primary num">
              {Math.round(avg * 100)}%
            </span>
          </div>
          {!readOnly && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="no-print delete-button text-text-muted hover:text-status-danger transition-colors p-2"
              aria-label="Objective 삭제"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* KR 카드 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
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
            className="no-print add-button kr-card min-h-[460px] rounded-2xl border-2 border-dashed border-border-default hover:border-status-success text-text-tertiary hover:text-status-success flex items-center justify-center gap-2 transition-colors"
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
