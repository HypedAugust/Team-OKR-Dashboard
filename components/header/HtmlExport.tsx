'use client';

import { Code2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

export function HtmlExport({ quarterName }: { quarterName?: string }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function exportHtml() {
    if (busy) return;
    setBusy(true);
    try {
      // 1) 외부 stylesheet 텍스트 수집 (same-origin fetch)
      const links = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
      );
      const cssChunks = await Promise.all(
        links.map(async (link) => {
          try {
            const res = await fetch(link.href);
            if (!res.ok) return '';
            return await res.text();
          } catch {
            return '';
          }
        })
      );

      // 2) 인라인 <style> 태그 내용도 수집 (next/jsx 등)
      const inlineStyles = Array.from(document.querySelectorAll('style'))
        .map((s) => s.textContent ?? '')
        .join('\n');

      // 3) <main> 복제
      const mainEl = document.querySelector('main');
      if (!mainEl) {
        toast.show('내보낼 콘텐츠를 찾지 못했습니다.', 'error');
        setBusy(false);
        return;
      }
      const clone = mainEl.cloneNode(true) as HTMLElement;

      // 4) 읽기 전용 정리 — 편집·인터랙션 요소 제거
      clone
        .querySelectorAll(
          '.no-print, [data-no-print="true"], .delete-button, .add-button, button, input, textarea, select'
        )
        .forEach((el) => el.remove());

      // 5) self-contained HTML 조립 (다크 테마 유지)
      const title = `OKR Dashboard${quarterName ? ` · ${quarterName}` : ''}`;
      const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
${cssChunks.join('\n')}
${inlineStyles}
/* HTML 스냅샷 보정 — 항상 다크 배경 */
html, body { background:#0B0B0D !important; margin:0; }
*, *::before, *::after { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
</style>
</head>
<body class="bg-bg-base text-text-primary">
${clone.outerHTML}
</body>
</html>`;

      // 6) 다운로드
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 10);
      const slug = (quarterName ?? 'okr').replace(/[^a-zA-Z0-9가-힣.]+/g, '');
      a.href = url;
      a.download = `okr-dashboard-${slug}-${stamp}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.show('HTML 파일을 내려받았습니다.');
    } catch (e) {
      toast.show('HTML 내보내기 실패', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={exportHtml}
      disabled={busy}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-transparent hover:bg-bg-surface2 text-text-secondary text-body-sm transition-colors disabled:opacity-50"
      title="현재 화면을 단일 HTML 파일로 저장 (읽기 전용)"
    >
      <Code2 size={14} />
      {busy ? '내보내는 중…' : 'HTML'}
    </button>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
