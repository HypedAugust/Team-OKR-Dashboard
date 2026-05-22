import { Suspense } from 'react';
import { DashboardClient } from '@/components/DashboardClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center">
          <div className="text-text-tertiary text-body-md">불러오는 중…</div>
        </main>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
