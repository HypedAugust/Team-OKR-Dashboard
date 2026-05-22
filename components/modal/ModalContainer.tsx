'use client';

import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

export function ModalContainer({
  title,
  onClose,
  children,
  footer,
  maxWidth = 480,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-black/70 grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface1 rounded-2xl border border-border-subtle shadow-2xl w-full"
        style={{ maxWidth: `${maxWidth}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
          <h3 className="text-heading-md text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-subtle">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
