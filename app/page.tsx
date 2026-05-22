import { DashboardClient } from '@/components/DashboardClient';
import { getActiveQuarterId, getBundle } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const requestedQid = searchParams.q ?? (await getActiveQuarterId());
  const bundle = await getBundle(requestedQid);
  return <DashboardClient bundle={bundle} />;
}
