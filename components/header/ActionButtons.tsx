'use client';

import { FileDown, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { NewQuarterModal } from '@/components/modal/NewQuarterModal';
import { MemberManageModal } from '@/components/modal/MemberManageModal';
import type { Member } from '@/lib/types';

export function ActionButtons({
  members,
  disabled,
}: {
  members: Member[];
  disabled: boolean;
}) {
  const [openNew, setOpenNew] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);

  function print() {
    window.print();
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => setOpenNew(true)}>
        <Plus size={16} />새 분기
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpenMembers(true)}
        disabled={disabled}
      >
        <Users size={16} />멤버 관리
      </Button>
      <Button variant="secondary" size="sm" onClick={print}>
        <FileDown size={16} />PDF 다운로드
      </Button>
      {openNew && <NewQuarterModal onClose={() => setOpenNew(false)} />}
      {openMembers && (
        <MemberManageModal members={members} onClose={() => setOpenMembers(false)} />
      )}
    </div>
  );
}
