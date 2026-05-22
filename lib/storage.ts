import 'server-only';
import { Redis } from '@upstash/redis';
import type {
  FinalScore,
  KR,
  Member,
  Objective,
  Quarter,
  QuarterBundle,
  Retro,
} from './types';

const STORAGE_KEY = 'okr-dashboard:v1';

let redisInstance: Redis | null = null;
function getRedis(): Redis {
  if (redisInstance) return redisInstance;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      'Upstash 환경변수가 설정되지 않았습니다. UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN 을 Vercel에 추가하세요.'
    );
  }
  redisInstance = new Redis({ url, token });
  return redisInstance;
}

export interface StorageState {
  quarters: Record<string, Quarter>;
  quartersOrder: string[];
  objectives: Record<string, { quarter_id: string; data: Objective }>;
  objectivesOrder: Record<string, string[]>;
  krs: Record<string, { quarter_id: string; data: KR }>;
  krsOrder: Record<string, string[]>;
  finalScores: Record<string, FinalScore>;
  retros: Record<string, Retro>;
  members: Member[];
}

const emptyState: StorageState = {
  quarters: {},
  quartersOrder: [],
  objectives: {},
  objectivesOrder: {},
  krs: {},
  krsOrder: {},
  finalScores: {},
  retros: {},
  members: [],
};

export async function readState(): Promise<StorageState> {
  try {
    const data = await getRedis().get<StorageState>(STORAGE_KEY);
    if (!data) return emptyState;
    return { ...emptyState, ...data };
  } catch (e) {
    console.error('[storage] readState failed:', e);
    return emptyState;
  }
}

export async function writeState(state: StorageState): Promise<void> {
  await getRedis().set(STORAGE_KEY, state);
}

export async function mutateState(
  updater: (s: StorageState) => StorageState
): Promise<void> {
  const current = await readState();
  const next = updater(current);
  await writeState(next);
}

export async function resetState(): Promise<void> {
  await getRedis().del(STORAGE_KEY);
}

export async function getActiveQuarterId(): Promise<string | null> {
  const state = await readState();
  for (const id of state.quartersOrder) {
    const q = state.quarters[id];
    if (q?.status === 'active') return id;
  }
  return state.quartersOrder[0] ?? null;
}

export async function getBundle(qid: string | null): Promise<QuarterBundle> {
  const state = await readState();
  const quartersList: Quarter[] = state.quartersOrder
    .map((id) => state.quarters[id])
    .filter((q): q is Quarter => Boolean(q));

  if (!qid || !state.quarters[qid]) {
    return {
      quarter: null,
      quartersList,
      objectives: [],
      finalScores: {},
      retros: {},
      members: state.members,
    };
  }

  const quarter = state.quarters[qid];
  const oids = state.objectivesOrder[qid] ?? [];

  const objectives = oids.map((oid) => {
    const objWrapper = state.objectives[oid];
    const kids = state.krsOrder[`${qid}:${oid}`] ?? [];
    const krs = kids
      .map((kid) => state.krs[kid]?.data)
      .filter((kr): kr is KR => Boolean(kr));
    return { ...(objWrapper?.data ?? { id: oid, title: '' }), krs };
  });

  const finalScores: Record<string, FinalScore> = {};
  const retros: Record<string, Retro> = {};
  for (const o of objectives) {
    for (const kr of o.krs) {
      const fs = state.finalScores[`${qid}:${kr.id}`];
      if (fs) finalScores[kr.id] = fs;
    }
  }
  for (const m of state.members) {
    const r = state.retros[`${qid}:${m.id}`];
    if (r) retros[m.id] = r;
  }

  return { quarter, quartersList, objectives, finalScores, retros, members: state.members };
}

export async function exportJson(): Promise<string> {
  const state = await readState();
  return JSON.stringify(state, null, 2);
}

export async function importJson(json: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null)
      return { ok: false, error: '잘못된 JSON 형식입니다.' };
    await writeState({ ...emptyState, ...parsed });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: `파일 해석 실패: ${e?.message ?? 'unknown'}` };
  }
}
