import type { ReactNode } from 'react';

export function SectionHeader({
  number,
  title,
  description,
  right,
}: {
  number: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-6 pb-4 border-b border-border-subtle">
      <div className="flex items-end gap-5">
        <span className="text-text-tertiary font-mono num leading-none" style={{ fontSize: '36px' }}>
          {number}
        </span>
        <div className="flex flex-col">
          <h2 className="text-heading-lg text-text-primary font-serif font-bold tracking-tight leading-tight">
            {title}
          </h2>
          {description && (
            <span className="text-body-sm text-text-tertiary mt-1">{description}</span>
          )}
        </div>
      </div>
      {right && <div className="flex items-center gap-3 flex-wrap">{right}</div>}
    </div>
  );
}
