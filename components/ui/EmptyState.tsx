import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-text-muted mb-6">{icon}</div>
      <h2 className="text-heading-md text-text-secondary mb-2">{title}</h2>
      {description && (
        <p className="text-body-md text-text-tertiary mb-8">{description}</p>
      )}
      {action}
    </div>
  );
}
