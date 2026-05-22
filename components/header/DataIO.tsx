'use client';

import { Download, Upload } from 'lucide-react';
import { useRef, useTransition } from 'react';
import { exportJsonAction, importJsonAction } from '@/app/actions';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

export function DataIO() {
  const toast = useToast();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  function doExport() {
    startTransition(async () => {
      const r = await exportJsonAction();
      if (!r.ok || !r.data) {
        toast.show(r.ok ? '데이터가 없습니다.' : r.error, 'error');
        return;
      }
      const blob = new Blob([r.data.json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `okr-dashboard-${stamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.show('JSON 파일을 내려받았습니다.');
    });
  }

  function doImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      startTransition(async () => {
        const r = await importJsonAction(String(reader.result ?? ''));
        if (r.ok) {
          toast.show('데이터를 불러왔습니다.');
          router.refresh();
        } else {
          toast.show(r.error, 'error');
        }
      });
    };
    reader.readAsText(file);
  }

  return (
    <>
      <button
        onClick={doExport}
        disabled={pending}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-transparent hover:bg-bg-surface2 text-text-secondary text-body-sm transition-colors disabled:opacity-50"
        title="현재 데이터를 JSON으로 저장"
      >
        <Download size={14} />
        Export
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        disabled={pending}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-transparent hover:bg-bg-surface2 text-text-secondary text-body-sm transition-colors disabled:opacity-50"
        title="JSON 파일을 불러와 현재 데이터를 덮어쓰기"
      >
        <Upload size={14} />
        Import
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) doImport(file);
          e.target.value = '';
        }}
      />
    </>
  );
}
