'use client';

import { useState, useTransition } from 'react';
import { updateFinalScore, type ActionResult } from '@/app/actions';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { useToast } from '@/components/ui/Toast';
import type { FinalScore, KR, Objective } from '@/lib/types';

export function ScoreTable({
  qid,
  objectives,
  finalScores,
  readOnly,
}: {
  qid: string;
  objectives: Array<Objective & { krs: KR[] }>;
  finalScores: Record<string, FinalScore>;
  readOnly: boolean;
}) {
  const allKrs = objectives.flatMap((o) => o.krs);

  if (allKrs.length === 0) return null;

  return (
    <section className="px-8 mt-12">
      <div className="mb-5">
        <h2 className="text-heading-lg text-text-primary mb-1">분기 점수표</h2>
        <p className="text-body-sm text-text-tertiary">분기 종료 후 KR별 결과와 평가를 기록합니다.</p>
      </div>
      <div className="bg-bg-surface1 rounded-xl border border-border-subtle overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-surface2 text-label-md text-text-tertiary">
              <th className="text-left px-4 py-3 w-24">KR</th>
              <th className="text-left px-4 py-3 w-24">유형</th>
              <th className="text-left px-4 py-3">목표</th>
              <th className="text-left px-4 py-3">결과</th>
              <th className="text-left px-4 py-3">평가</th>
            </tr>
          </thead>
          <tbody>
            {allKrs.map((kr) => (
              <ScoreRow
                key={kr.id}
                qid={qid}
                kr={kr}
                score={finalScores[kr.id]}
                readOnly={readOnly}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScoreRow({
  qid,
  kr,
  score,
  readOnly,
}: {
  qid: string;
  kr: KR;
  score?: FinalScore;
  readOnly: boolean;
}) {
  return (
    <tr className="score-row border-t border-border-subtle">
      <td className="px-4 py-4 align-top">
        <span className="text-body-md text-text-primary num">{kr.id}</span>
      </td>
      <td className="px-4 py-4 align-top">
        <TypeBadge type={kr.type} />
      </td>
      <td className="px-4 py-4 align-top">
        <span className="text-body-md text-text-secondary">{kr.target_text || '—'}</span>
      </td>
      <td className="px-4 py-4 align-top">
        <EditableCell
          value={score?.result_text ?? ''}
          placeholder="분기 종료 후 작성"
          readOnly={readOnly}
          onSave={(v) => updateFinalScore(qid, kr.id, { result_text: v })}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <EditableCell
          value={score?.evaluation ?? ''}
          placeholder="분기 종료 후 작성"
          readOnly={readOnly}
          onSave={(v) => updateFinalScore(qid, kr.id, { evaluation: v })}
        />
      </td>
    </tr>
  );
}

function EditableCell({
  value,
  placeholder,
  readOnly,
  onSave,
}: {
  value: string;
  placeholder: string;
  readOnly: boolean;
  onSave: (v: string) => Promise<ActionResult>;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const [, startTransition] = useTransition();
  const toast = useToast();

  if (readOnly) {
    return (
      <div className="text-body-md text-text-secondary whitespace-pre-wrap break-words min-h-[1.5rem]">
        {value || <span className="text-text-muted">—</span>}
      </div>
    );
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-left text-body-md text-text-secondary whitespace-pre-wrap break-words w-full min-h-[1.5rem] hover:text-text-primary transition-colors"
      >
        {value || <span className="text-text-muted">{placeholder}</span>}
      </button>
    );
  }

  return (
    <textarea
      autoFocus
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        startTransition(async () => {
          const r = await onSave(text);
          if (!r.ok) toast.show(r.error, 'error');
        });
        setEditing(false);
      }}
      className="w-full px-2 py-1 bg-bg-surface3 border border-border-strong rounded-md text-text-primary text-body-md focus:outline-none resize-y min-h-[60px]"
    />
  );
}
