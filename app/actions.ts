'use server';

import { revalidatePath } from 'next/cache';
import {
  getMembers,
  getQuarter,
  getQuartersList,
  k,
  kv,
  pushToList,
  removeFromList,
  setMembers,
} from '@/lib/kv';
import { nextKRId, nextSerialId, slugify } from '@/lib/id';
import { TEXT_MAX_LENGTH } from '@/lib/constants';
import type {
  Confidence,
  FinalScore,
  KR,
  KRType,
  Member,
  Objective,
  Quarter,
  Retro,
} from '@/lib/types';

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

function trim(s: string | undefined, max: number): string {
  return (s ?? '').toString().trim().slice(0, max);
}

async function assertActive(qid: string): Promise<Quarter | { error: string }> {
  const q = await getQuarter(qid);
  if (!q) return { error: '분기를 찾을 수 없습니다.' };
  if (q.status !== 'active') return { error: '활성 분기가 아닙니다.' };
  return q;
}

function revalidate() {
  revalidatePath('/');
}

/* ─── Quarter ────────────────────────────────────────────── */
export async function createQuarter(input: {
  name: string;
  start_date: string;
  end_date: string;
}): Promise<ActionResult<{ qid: string }>> {
  try {
    const name = trim(input.name, TEXT_MAX_LENGTH.quarterName);
    if (!name) return { ok: false, error: '분기명을 입력하세요.' };
    if (!input.start_date || !input.end_date)
      return { ok: false, error: '시작일과 종료일을 입력하세요.' };

    const qid = slugify(name) || `q-${Date.now()}`;
    const existing = await getQuarter(qid);
    if (existing) return { ok: false, error: '이미 존재하는 분기입니다.' };

    const ids = await getQuartersList();
    for (const id of ids) {
      const q = await getQuarter(id);
      if (q?.status === 'active') {
        await kv.set(k.quarter(id), { ...q, status: 'archived' });
      }
    }

    const quarter: Quarter = {
      id: qid,
      name,
      start_date: input.start_date,
      end_date: input.end_date,
      status: 'active',
    };
    await kv.set(k.quarter(qid), quarter);
    const list = await getQuartersList();
    await kv.set(k.quartersList(), [qid, ...list]);
    await kv.set(k.objectives(qid), []);
    revalidate();
    return { ok: true, data: { qid } };
  } catch (e) {
    return { ok: false, error: '분기 생성 실패' };
  }
}

/* ─── Objective ──────────────────────────────────────────── */
export async function createObjective(
  qid: string,
  title: string
): Promise<ActionResult<{ oid: string }>> {
  try {
    const check = await assertActive(qid);
    if ('error' in check) return { ok: false, error: check.error };
    const t = trim(title, TEXT_MAX_LENGTH.objectiveTitle);
    if (!t) return { ok: false, error: '제목을 입력하세요.' };
    const ids = ((await kv.get<string[]>(k.objectives(qid))) ?? []);
    const oid = nextSerialId(ids, 'O');
    const obj: Objective = { id: oid, title: t };
    await kv.set(k.objective(qid, oid), obj);
    await kv.set(k.krs(qid, oid), []);
    await pushToList(k.objectives(qid), oid);
    revalidate();
    return { ok: true, data: { oid } };
  } catch {
    return { ok: false, error: 'Objective 생성 실패' };
  }
}

export async function updateObjective(
  qid: string,
  oid: string,
  patch: { title?: string }
): Promise<ActionResult> {
  try {
    const check = await assertActive(qid);
    if ('error' in check) return { ok: false, error: check.error };
    const existing = await kv.get<Objective>(k.objective(qid, oid));
    if (!existing) return { ok: false, error: 'Objective를 찾을 수 없습니다.' };
    const updated: Objective = {
      ...existing,
      title: patch.title !== undefined ? trim(patch.title, TEXT_MAX_LENGTH.objectiveTitle) : existing.title,
    };
    await kv.set(k.objective(qid, oid), updated);
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: '저장 실패' };
  }
}

export async function deleteObjective(qid: string, oid: string): Promise<ActionResult> {
  try {
    const check = await assertActive(qid);
    if ('error' in check) return { ok: false, error: check.error };
    const krIds = ((await kv.get<string[]>(k.krs(qid, oid))) ?? []);
    for (const kid of krIds) {
      await kv.del(k.kr(qid, kid));
      await kv.del(k.finalScore(qid, kid));
    }
    await kv.del(k.krs(qid, oid));
    await kv.del(k.objective(qid, oid));
    await removeFromList(k.objectives(qid), oid);
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: '삭제 실패' };
  }
}

/* ─── KR ─────────────────────────────────────────────────── */
export async function createKR(
  qid: string,
  oid: string,
  input?: { type?: KRType; target_text?: string }
): Promise<ActionResult<{ kid: string }>> {
  try {
    const check = await assertActive(qid);
    if ('error' in check) return { ok: false, error: check.error };
    const krIds = ((await kv.get<string[]>(k.krs(qid, oid))) ?? []);
    const kid = nextKRId(krIds, oid);
    const kr: KR = {
      id: kid,
      objective_id: oid,
      type: input?.type ?? 'Aspire',
      owners: [],
      target_text: trim(input?.target_text, TEXT_MAX_LENGTH.krTargetText),
      current_value: 0,
      current_detail: '',
      progress: 0,
      confidence: 'mid',
      updated_at: null,
    };
    await kv.set(k.kr(qid, kid), kr);
    await pushToList(k.krs(qid, oid), kid);
    revalidate();
    return { ok: true, data: { kid } };
  } catch {
    return { ok: false, error: 'KR 생성 실패' };
  }
}

export async function updateKR(
  qid: string,
  kid: string,
  patch: Partial<{
    type: KRType;
    owners: string[];
    target_text: string;
    current_value: number;
    current_detail: string;
    progress: number;
    confidence: Confidence;
  }>
): Promise<ActionResult> {
  try {
    const check = await assertActive(qid);
    if ('error' in check) return { ok: false, error: check.error };
    const existing = await kv.get<KR>(k.kr(qid, kid));
    if (!existing) return { ok: false, error: 'KR을 찾을 수 없습니다.' };
    const updated: KR = {
      ...existing,
      ...patch,
      target_text:
        patch.target_text !== undefined
          ? trim(patch.target_text, TEXT_MAX_LENGTH.krTargetText)
          : existing.target_text,
      current_detail:
        patch.current_detail !== undefined
          ? trim(patch.current_detail, TEXT_MAX_LENGTH.currentDetail)
          : existing.current_detail,
      updated_at: new Date().toISOString(),
    };
    await kv.set(k.kr(qid, kid), updated);
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: '저장 실패' };
  }
}

export async function deleteKR(qid: string, oid: string, kid: string): Promise<ActionResult> {
  try {
    const check = await assertActive(qid);
    if ('error' in check) return { ok: false, error: check.error };
    await kv.del(k.kr(qid, kid));
    await kv.del(k.finalScore(qid, kid));
    await removeFromList(k.krs(qid, oid), kid);
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: '삭제 실패' };
  }
}

/* ─── Final Score ────────────────────────────────────────── */
export async function updateFinalScore(
  qid: string,
  kid: string,
  patch: { result_text?: string; evaluation?: string }
): Promise<ActionResult> {
  try {
    const check = await assertActive(qid);
    if ('error' in check) return { ok: false, error: check.error };
    const existing = (await kv.get<FinalScore>(k.finalScore(qid, kid))) ?? {
      kr_id: kid,
      result_text: '',
      evaluation: '',
    };
    const updated: FinalScore = {
      kr_id: kid,
      result_text:
        patch.result_text !== undefined
          ? trim(patch.result_text, TEXT_MAX_LENGTH.finalScoreText)
          : existing.result_text,
      evaluation:
        patch.evaluation !== undefined
          ? trim(patch.evaluation, TEXT_MAX_LENGTH.finalScoreText)
          : existing.evaluation,
    };
    await kv.set(k.finalScore(qid, kid), updated);
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: '저장 실패' };
  }
}

/* ─── Retro ──────────────────────────────────────────────── */
export async function updateRetro(
  qid: string,
  mid: string,
  patch: { keep?: string; problem?: string; try_?: string }
): Promise<ActionResult> {
  try {
    const check = await assertActive(qid);
    if ('error' in check) return { ok: false, error: check.error };
    const existing = (await kv.get<Retro>(k.retro(qid, mid))) ?? {
      member_id: mid,
      keep: '',
      problem: '',
      try_: '',
    };
    const updated: Retro = {
      member_id: mid,
      keep: patch.keep !== undefined ? trim(patch.keep, TEXT_MAX_LENGTH.retroText) : existing.keep,
      problem:
        patch.problem !== undefined
          ? trim(patch.problem, TEXT_MAX_LENGTH.retroText)
          : existing.problem,
      try_:
        patch.try_ !== undefined ? trim(patch.try_, TEXT_MAX_LENGTH.retroText) : existing.try_,
    };
    await kv.set(k.retro(qid, mid), updated);
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: '저장 실패' };
  }
}

/* ─── Member ─────────────────────────────────────────────── */
export async function addMember(name: string): Promise<ActionResult<{ mid: string }>> {
  try {
    const trimmed = trim(name, TEXT_MAX_LENGTH.memberName);
    if (!trimmed) return { ok: false, error: '이름을 입력하세요.' };
    const members = await getMembers();
    let baseId = slugify(trimmed) || `m-${Date.now()}`;
    let mid = baseId;
    let i = 2;
    while (members.some((m) => m.id === mid)) {
      mid = `${baseId}-${i++}`;
    }
    members.push({ id: mid, name: trimmed });
    await setMembers(members);
    revalidate();
    return { ok: true, data: { mid } };
  } catch {
    return { ok: false, error: '멤버 추가 실패' };
  }
}

export async function deleteMember(mid: string): Promise<ActionResult> {
  try {
    const members = await getMembers();
    await setMembers(members.filter((m) => m.id !== mid));
    // 모든 분기의 KR owners에서 제거
    const qids = await getQuartersList();
    for (const qid of qids) {
      const oIds = ((await kv.get<string[]>(k.objectives(qid))) ?? []);
      for (const oid of oIds) {
        const kIds = ((await kv.get<string[]>(k.krs(qid, oid))) ?? []);
        for (const kid of kIds) {
          const kr = await kv.get<KR>(k.kr(qid, kid));
          if (kr && kr.owners.includes(mid)) {
            await kv.set(k.kr(qid, kid), {
              ...kr,
              owners: kr.owners.filter((o) => o !== mid),
            });
          }
        }
      }
    }
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: '멤버 삭제 실패' };
  }
}
