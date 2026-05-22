'use client';

import { Plus, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { addMember, deleteMember } from '@/app/actions';
import { ModalContainer } from './ModalContainer';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import type { Member } from '@/lib/types';

export function MemberManageModal({
  members,
  onClose,
}: {
  members: Member[];
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [pending, startTransition] = useTransition();
  const [confirmTarget, setConfirmTarget] = useState<Member | null>(null);
  const toast = useToast();

  function add() {
    if (!name.trim()) return;
    startTransition(async () => {
      const r = await addMember(name);
      if (r.ok) {
        toast.show('멤버를 추가했습니다.');
        setName('');
      } else {
        toast.show(r.error, 'error');
      }
    });
  }

  return (
    <>
      <ModalContainer
        title="멤버 관리"
        onClose={onClose}
        footer={
          <Button variant="secondary" size="sm" onClick={onClose}>
            닫기
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') add();
              }}
              placeholder="새 멤버 이름"
              className="flex-1 px-3 py-2 bg-bg-surface3 border border-border-default rounded-md text-text-primary text-body-md focus:outline-none focus:border-border-strong"
            />
            <Button variant="primary" size="sm" onClick={add} disabled={pending}>
              <Plus size={16} />추가
            </Button>
          </div>
          <div className="space-y-2">
            {members.length === 0 ? (
              <p className="text-body-sm text-text-tertiary text-center py-4">
                아직 멤버가 없습니다.
              </p>
            ) : (
              members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-3 py-2 bg-bg-surface2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-bg-surface3 grid place-items-center text-body-sm text-text-secondary">
                      {m.name.charAt(0)}
                    </span>
                    <span className="text-body-md text-text-primary">{m.name}</span>
                  </div>
                  <button
                    onClick={() => setConfirmTarget(m)}
                    className="text-text-tertiary hover:text-status-danger"
                    aria-label="멤버 삭제"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </ModalContainer>
      {confirmTarget && (
        <ConfirmDialog
          title="멤버 삭제"
          description={`'${confirmTarget.name}'을(를) 삭제하시겠습니까? 모든 KR Owner와 KPT 회고에서도 제거됩니다.`}
          variant="danger"
          confirmLabel="삭제"
          onCancel={() => setConfirmTarget(null)}
          onConfirm={async () => {
            const r = await deleteMember(confirmTarget.id);
            if (!r.ok) toast.show(r.error, 'error');
            setConfirmTarget(null);
          }}
        />
      )}
    </>
  );
}
