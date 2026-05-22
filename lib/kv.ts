import { kv } from '@vercel/kv';
import type {
  FinalScore,
  KR,
  Member,
  Objective,
  Quarter,
  QuarterBundle,
  Retro,
} from './types';

export const k = {
  quartersList: () => 'quarters:list',
  quarter: (qid: string) => `quarter:${qid}`,
  objectives: (qid: string) => `quarter:${qid}:objectives`,
  objective: (qid: string, oid: string) => `quarter:${qid}:objective:${oid}`,
  krs: (qid: string, oid: string) => `quarter:${qid}:objective:${oid}:krs`,
  kr: (qid: string, kid: string) => `quarter:${qid}:kr:${kid}`,
  finalScore: (qid: string, kid: string) => `quarter:${qid}:final_score:${kid}`,
  retro: (qid: string, mid: string) => `quarter:${qid}:retro:${mid}`,
  membersList: () => 'members:list',
};

async function getList<T = string>(key: string): Promise<T[]> {
  const value = await kv.get<T[]>(key);
  return value ?? [];
}

async function setList<T>(key: string, list: T[]): Promise<void> {
  await kv.set(key, list);
}

export async function getQuartersList(): Promise<string[]> {
  return getList<string>(k.quartersList());
}

export async function getQuarter(qid: string): Promise<Quarter | null> {
  return (await kv.get<Quarter>(k.quarter(qid))) ?? null;
}

export async function getActiveQuarterId(): Promise<string | null> {
  const ids = await getQuartersList();
  for (const id of ids) {
    const q = await getQuarter(id);
    if (q?.status === 'active') return id;
  }
  return ids[0] ?? null;
}

export async function getMembers(): Promise<Member[]> {
  return (await kv.get<Member[]>(k.membersList())) ?? [];
}

export async function setMembers(members: Member[]): Promise<void> {
  await kv.set(k.membersList(), members);
}

export async function getQuarterBundle(qid: string | null): Promise<QuarterBundle> {
  const quartersIds = await getQuartersList();
  const quartersList: Quarter[] = [];
  for (const id of quartersIds) {
    const q = await getQuarter(id);
    if (q) quartersList.push(q);
  }
  const members = await getMembers();

  if (!qid) {
    return {
      quarter: null,
      quartersList,
      objectives: [],
      finalScores: {},
      retros: {},
      members,
    };
  }

  const quarter = await getQuarter(qid);
  if (!quarter) {
    return {
      quarter: null,
      quartersList,
      objectives: [],
      finalScores: {},
      retros: {},
      members,
    };
  }

  const objectiveIds = await getList<string>(k.objectives(qid));
  const objectives: Array<Objective & { krs: KR[] }> = [];

  for (const oid of objectiveIds) {
    const obj = await kv.get<Objective>(k.objective(qid, oid));
    if (!obj) continue;
    const krIds = await getList<string>(k.krs(qid, oid));
    const krs: KR[] = [];
    for (const kid of krIds) {
      const kr = await kv.get<KR>(k.kr(qid, kid));
      if (kr) krs.push(kr);
    }
    objectives.push({ ...obj, krs });
  }

  const allKrIds = objectives.flatMap((o) => o.krs.map((kr) => kr.id));
  const finalScores: Record<string, FinalScore> = {};
  for (const kid of allKrIds) {
    const fs = await kv.get<FinalScore>(k.finalScore(qid, kid));
    if (fs) finalScores[kid] = fs;
  }

  const retros: Record<string, Retro> = {};
  for (const m of members) {
    const r = await kv.get<Retro>(k.retro(qid, m.id));
    if (r) retros[m.id] = r;
  }

  return {
    quarter,
    quartersList,
    objectives,
    finalScores,
    retros,
    members,
  };
}

export async function pushToList(key: string, value: string): Promise<void> {
  const list = await getList<string>(key);
  if (!list.includes(value)) {
    list.push(value);
    await setList(key, list);
  }
}

export async function removeFromList(key: string, value: string): Promise<void> {
  const list = await getList<string>(key);
  const filtered = list.filter((v) => v !== value);
  await setList(key, filtered);
}

export { kv };
