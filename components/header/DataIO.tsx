'use client';

import { Download, Upload } from 'lucide-react';
import { useRef } from 'react';
import { exportJson, importJson } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';

export function DataIO() {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  function doExport() {
    const json = exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `okr-dashboard-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.show('JSON 파일을 내려받았습니다.');
  }

  function doImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = importJson(String(reader.result ?? ''));
      if (result.ok) {
        toast.show('데이터를 불러왔습니다.');
      } else {
        toast.show(result.error, 'error');
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      <button
        onClick={doExport}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-transparent hover:bg-bg-surface2 text-text-secondary text-body-sm transition-colors"
        title="현재 데이터를 JSON으로 저장"
      >
        <Download size={14} />
        Export
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-transparent hover:bg-bg-surface2 text-text-secondary text-body-sm transition-colors"
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
