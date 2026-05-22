'use client';

import { useTransition } from 'react';
import { ModalContainer } from './ModalContainer';
import { Button } from '@/components/ui/Button';

export function ConfirmDialog({
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'primary',
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger';
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      await onConfirm();
    });
  }

  return (
    <ModalContainer
      title={title}
      onClose={onCancel}
      maxWidth={400}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} size="sm" onClick={confirm} disabled={pending}>
            {pending ? '처리 중...' : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-body-md text-text-secondary leading-relaxed">{description}</p>
    </ModalContainer>
  );
}
