'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createQuarter } from '@/app/actions';
import { ModalContainer } from './ModalContainer';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export function NewQuarterModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function submit() {
    setError(null);
    startTransition(async () => {
      const r = await createQuarter({ name, start_date: start, end_date: end });
      if (r.ok && r.data) {
        toast.show('새 분기를 생성했습니다.');
        router.push(`/?q=${encodeURIComponent(r.data.qid)}`);
        onClose();
      } else if (!r.ok) {
        setError(r.error);
      }
    });
  }

  return (
    <ModalContainer
      title="새 분기 만들기"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={pending}>
            취소
          </Button>
          <Button variant="primary" size="sm" onClick={submit} disabled={pending}>
            {pending ? '생성 중...' : '생성'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="분기명">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 26.Q3"
            className="w-full px-3 py-2 bg-bg-surface3 border border-border-default rounded-md text-text-primary text-body-md focus:outline-none focus:border-border-strong"
          />
        </Field>
        <Field label="시작일">
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full px-3 py-2 bg-bg-surface3 border border-border-default rounded-md text-text-primary text-body-md focus:outline-none focus:border-border-strong"
          />
        </Field>
        <Field label="종료일">
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full px-3 py-2 bg-bg-surface3 border border-border-default rounded-md text-text-primary text-body-md focus:outline-none focus:border-border-strong"
          />
        </Field>
        {error && (
          <p className="text-body-sm text-status-danger bg-status-danger-soft px-3 py-2 rounded-md">
            {error}
          </p>
        )}
        <p className="text-caption text-text-tertiary">
          새 분기를 생성하면 현재 활성 분기는 자동으로 아카이브됩니다.
        </p>
      </div>
    </ModalContainer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-label-md text-text-tertiary mb-1.5">{label}</span>
      {children}
    </label>
  );
}
