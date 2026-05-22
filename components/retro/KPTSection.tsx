'use client';

import { useState, useTransition } from 'react';
import { updateRetro, type ActionResult } from '@/app/actions';
import { useToast } from '@/components/ui/Toast';
import type { Member, Retro } from '@/lib/types';

export function KPTSection({
  qid,
  members,
  retros,
  readOnly,
}: {
  qid: string;
  members: Member[];
  retros: Record<string, Retro>;
  readOnly: boolean;
}) {
  if (members.length === 0) return null;

  return (
    <section className="px-8 mt-12 mb-16">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-1 h-7 bg-status-success rounded-full" />
        <h2 className="text-heading-md text-text-primary">KPT 회고</h2>
      </div>
      <p className="text-body-sm text-text-tertiary mb-5">
        멤버별로 Keep / Problem / Try를 기록합니다.
      </p>
      <div
        className="kpt-grid grid gap-5 print:!gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.min(Math.max(members.length, 1), 4)}, minmax(0, 1fr))`,
        }}
      >
        {members.map((m) => (
          <KPTCard
            key={m.id}
            qid={qid}
            member={m}
            retro={retros[m.id]}
            readOnly={readOnly}
          />
        ))}
      </div>
    </section>
  );
}

function KPTCard({
  qid,
  member,
  retro,
  readOnly,
}: {
  qid: string;
  member: Member;
  retro?: Retro;
  readOnly: boolean;
}) {
  return (
    <div className="kpt-card bg-bg-surface1 rounded-xl p-5 border border-border-subtle">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-subtle">
        <span className="w-7 h-7 rounded-full bg-bg-surface3 grid place-items-center text-body-sm text-text-secondary">
          {member.name.charAt(0)}
        </span>
        <span className="text-heading-md text-text-primary">{member.name}</span>
      </div>
      <div className="space-y-4">
        <RetroField
          label="Keep"
          accent="success"
          value={retro?.keep ?? ''}
          readOnly={readOnly}
          onSave={(v) => updateRetro(qid, member.id, { keep: v })}
        />
        <RetroField
          label="Problem"
          accent="danger"
          value={retro?.problem ?? ''}
          readOnly={readOnly}
          onSave={(v) => updateRetro(qid, member.id, { problem: v })}
        />
        <RetroField
          label="Try"
          accent="warning"
          value={retro?.try_ ?? ''}
          readOnly={readOnly}
          onSave={(v) => updateRetro(qid, member.id, { try_: v })}
        />
      </div>
    </div>
  );
}

const accentColor = {
  success: 'border-l-status-success text-status-success',
  warning: 'border-l-status-warning text-status-warning',
  danger: 'border-l-status-danger text-status-danger',
} as const;

function RetroField({
  label,
  accent,
  value,
  readOnly,
  onSave,
}: {
  label: string;
  accent: 'success' | 'warning' | 'danger';
  value: string;
  readOnly: boolean;
  onSave: (v: string) => Promise<ActionResult>;
}) {
  const [text, setText] = useState(value);
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();
  const toast = useToast();

  function save() {
    startTransition(async () => {
      const r = await onSave(text);
      if (!r.ok) toast.show(r.error, 'error');
    });
    setEditing(false);
  }

  return (
    <div className={`border-l-2 pl-3 ${accentColor[accent].split(' ')[0]}`}>
      <div className={`text-label-sm uppercase tracking-wide ${accentColor[accent].split(' ')[1]} mb-1`}>
        {label}
      </div>
      {readOnly ? (
        <div className="text-body-md text-text-secondary whitespace-pre-wrap break-words min-h-[1.5rem]">
          {value || <span className="text-text-muted">—</span>}
        </div>
      ) : editing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={save}
          className="w-full px-2 py-1 bg-bg-surface3 border border-border-strong rounded-md text-text-primary text-body-md focus:outline-none resize-y min-h-[60px]"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-left text-body-md text-text-secondary w-full whitespace-pre-wrap break-words min-h-[1.5rem] hover:text-text-primary transition-colors"
        >
          {value || <span className="text-text-muted">분기 종료 후 작성하세요</span>}
        </button>
      )}
    </div>
  );
}
