'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Quarter } from '@/lib/types';

export function QuarterSelector({
  current,
  quarters,
}: {
  current: Quarter | null;
  quarters: Quarter[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function select(qid: string) {
    setOpen(false);
    router.push(`/?q=${encodeURIComponent(qid)}`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface2 hover:bg-bg-surface3 text-text-primary text-body-md transition-colors"
      >
        <span className="num">{current?.name ?? '분기 선택'}</span>
        <ChevronDown size={16} className="text-text-tertiary" />
      </button>
      {open && quarters.length > 0 && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-bg-surface2 rounded-lg shadow-2xl border border-border-subtle py-2 z-50">
          {quarters.map((q) => {
            const isActive = q.status === 'active';
            const isCurrent = q.id === current?.id;
            return (
              <button
                key={q.id}
                onClick={() => select(q.id)}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-bg-surface3 transition-colors ${
                  isCurrent ? 'bg-bg-surface3' : ''
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-status-success' : 'bg-text-muted'
                  }`}
                />
                <span
                  className={`num ${
                    isActive ? 'text-text-primary font-medium' : 'text-text-tertiary'
                  }`}
                >
                  {q.name}
                </span>
                {!isActive && (
                  <span className="text-caption text-text-muted ml-auto">아카이브</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
