'use server';

import { revalidatePath } from 'next/cache';
import { TEXT_MAX_LENGTH } from '@/lib/constants';
import { nextKRId, nextSerialId, slugify } from '@/lib/id';
import { mutateState, readState, writeState } from '@/lib/storage';
import type {
  Confidence,
  FinalScore,
  KR,
  KRType,
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

function ok<T>(data?: T): ActionResult<T> {
  return { ok: true, data };
}
function err<T = void>(msg: string): ActionResult<T> {
  return { ok: false, error: msg };
}

function revalidate() {
  revalidatePath('/');
}

async function assertActive(qid: string): Promise<Quarter | string> {
  const state = await readState();
  const q = state.quarters[qid];
  if (!q) return '분기를 찾을 수 없습니다.';
  if (q.status !== 'active') return '활성 분기가 아닙니다.';
  return q;
}

/* ─── Quarter ────────────────────────────────────────────── */
export async function createQuarter(input: {
  name: string;
  start_date: string;
  end_date: string;
}): Promise<ActionResult<{ qid: string }>> {
  try {
    const name = trim(input.name, TEXT_MAX_LENGTH.quarterName);
    if (!name) return err('분기명을 입력하세요.');
    if (!input.start_date || !input.end_date) return err('시작일과 종료일을 입력하세요.');

    const qid = slugify(name) || `q-${Date.now()}`;
    const state = await readState();
    if (state.quarters[qid]) return err('이미 존재하는 분기입니다.');

    await mutateState((s) => {
      const nextQuarters = { ...s.quarters };
      for (const id of s.quartersOrder) {
        const q = nextQuarters[id];
        if (q?.status === 'active') nextQuarters[id] = { ...q, status: 'archived' };
      }
      nextQuarters[qid] = {
        id: qid,
        name,
        start_date: input.start_date,
        end_date: input.end_date,
        status: 'active',
      };
      return {
        ...s,
        quarters: nextQuarters,
        quartersOrder: [qid, ...s.quartersOrder],
        objectivesOrder: { ...s.objectivesOrder, [qid]: [] },
      };
    });
    revalidate();
    return ok({ qid });
  } catch (e: any) {
    return err(`분기 생성 실패: ${e?.message ?? ''}`);
  }
}

/* ─── Objective ──────────────────────────────────────────── */
export async function createObjective(
  qid: string,
  title: string
): Promise<ActionResult<{ oid: string }>> {
  const check = await assertActive(qid);
  if (typeof check === 'string') return err(check);

  const state = await readState();
  const existing = state.objectivesOrder[qid] ?? [];
  const oid = nextSerialId(existing, 'O');
  const t = trim(title, TEXT_MAX_LENGTH.objectiveTitle) || '새 Objective';

  await mutateState((s) => ({
    ...s,
    objectives: { ...s.objectives, [oid]: { quarter_id: qid, data: { id: oid, title: t } } },
    objectivesOrder: {
      ...s.objectivesOrder,
      [qid]: [...(s.objectivesOrder[qid] ?? []), oid],
    },
    krsOrder: { ...s.krsOrder, [`${qid}:${oid}`]: [] },
  }));
  revalidate();
  return ok({ oid });
}

export async function updateObjective(
  qid: string,
  oid: string,
  patch: { title?: string }
): Promise<ActionResult> {
  const check = await assertActive(qid);
  if (typeof check === 'string') return err(check);

  const state = await readState();
  const existing = state.objectives[oid]?.data;
  if (!existing) return err('Objective를 찾을 수 없습니다.');

  await mutateState((s) => ({
    ...s,
    objectives: {
      ...s.objectives,
      [oid]: {
        quarter_id: qid,
        data: {
          ...existing,
          title:
            patch.title !== undefined
              ? trim(patch.title, TEXT_MAX_LENGTH.objectiveTitle)
              : existing.title,
        },
      },
    },
  }));
  revalidate();
  return ok();
}

export async function deleteObjective(qid: string, oid: string): Promise<ActionResult> {
  const check = await assertActive(qid);
  if (typeof check === 'string') return err(check);

  await mutateState((s) => {
    const krIds = s.krsOrder[`${qid}:${oid}`] ?? [];
    const nextKrs = { ...s.krs };
    const nextScores = { ...s.finalScores };
    for (const kid of krIds) {
      delete nextKrs[kid];
      delete nextScores[`${qid}:${kid}`];
    }
    const nextObjectives = { ...s.objectives };
    delete nextObjectives[oid];
    const nextOrder = { ...s.objectivesOrder };
    nextOrder[qid] = (nextOrder[qid] ?? []).filter((x) => x !== oid);
    const nextKrsOrder = { ...s.krsOrder };
    delete nextKrsOrder[`${qid}:${oid}`];

    return {
      ...s,
      krs: nextKrs,
      objectives: nextObjectives,
      objectivesOrder: nextOrder,
      krsOrder: nextKrsOrder,
      finalScores: nextScores,
    };
  });
  revalidate();
  return ok();
}

/* ─── KR ─────────────────────────────────────────────────── */
export async function createKR(
  qid: string,
  oid: string,
  input?: { type?: KRType; target_text?: string; target_value?: number | null }
): Promise<ActionResult<{ kid: string }>> {
  const check = await assertActive(qid);
  if (typeof check === 'string') return err(check);

  const state = await readState();
  const existing = state.krsOrder[`${qid}:${oid}`] ?? [];
  const kid = nextKRId(existing, oid);

  await mutateState((s) => {
    const kr: KR = {
      id: kid,
      objective_id: oid,
      type: input?.type ?? 'Aspire',
      owners: [],
      target_text: trim(input?.target_text, TEXT_MAX_LENGTH.krTargetText),
      target_value: input?.target_value ?? null,
      current_value: 0,
      current_detail: '',
      progress: 0,
      confidence: 'mid',
      updated_at: null,
    };
    return {
      ...s,
      krs: { ...s.krs, [kid]: { quarter_id: qid, data: kr } },
      krsOrder: {
        ...s.krsOrder,
        [`${qid}:${oid}`]: [...(s.krsOrder[`${qid}:${oid}`] ?? []), kid],
      },
    };
  });
  revalidate();
  return ok({ kid });
}

export async function updateKR(
  qid: string,
  kid: string,
  patch: Partial<{
    type: KRType;
    owners: string[];
    target_text: string;
    target_value: number | null;
    current_value: number;
    current_detail: string;
    progress: number;
    confidence: Confidence;
  }>
): Promise<ActionResult> {
  const check = await assertActive(qid);
  if (typeof check === 'string') return err(check);

  const state = await readState();
  const existing = state.krs[kid]?.data;
  if (!existing) return err('KR을 찾을 수 없습니다.');

  const mergedTarget =
    patch.target_value !== undefined ? patch.target_value : existing.target_value;
  const mergedCurrent =
    patch.current_value !== undefined ? patch.current_value : existing.current_value;

  let computedProgress: number;
  if (mergedTarget !== null && mergedTarget > 0) {
    computedProgress = Math.max(0, Math.min(2, mergedCurrent / mergedTarget));
  } else if (patch.progress !== undefined) {
    computedProgress = patch.progress;
  } else {
    computedProgress = existing.progress;
  }

  await mutateState((s) => ({
    ...s,
    krs: {
      ...s.krs,
      [kid]: {
        quarter_id: qid,
        data: {
          ...existing,
          ...patch,
          target_text:
            patch.target_text !== undefined
              ? trim(patch.target_text, TEXT_MAX_LENGTH.krTargetText)
              : existing.target_text,
          target_value: mergedTarget,
          current_detail:
            patch.current_detail !== undefined
              ? trim(patch.current_detail, TEXT_MAX_LENGTH.currentDetail)
              : existing.current_detail,
          progress: computedProgress,
          updated_at: new Date().toISOString(),
        },
      },
    },
  }));
  revalidate();
  return ok();
}

export async function deleteKR(
  qid: string,
  oid: string,
  kid: string
): Promise<ActionResult> {
  const check = await assertActive(qid);
  if (typeof check === 'string') return err(check);

  await mutateState((s) => {
    const nextKrs = { ...s.krs };
    delete nextKrs[kid];
    const nextOrder = { ...s.krsOrder };
    nextOrder[`${qid}:${oid}`] = (nextOrder[`${qid}:${oid}`] ?? []).filter((x) => x !== kid);
    const nextScores = { ...s.finalScores };
    delete nextScores[`${qid}:${kid}`];
    return { ...s, krs: nextKrs, krsOrder: nextOrder, finalScores: nextScores };
  });
  revalidate();
  return ok();
}

/* ─── Retro ──────────────────────────────────────────────── */
export async function updateRetro(
  qid: string,
  mid: string,
  patch: { keep?: string; problem?: string; try_?: string }
): Promise<ActionResult> {
  const check = await assertActive(qid);
  if (typeof check === 'string') return err(check);

  await mutateState((s) => {
    const key = `${qid}:${mid}`;
    const existing = s.retros[key] ?? { member_id: mid, keep: '', problem: '', try_: '' };
    const next: Retro = {
      member_id: mid,
      keep:
        patch.keep !== undefined ? trim(patch.keep, TEXT_MAX_LENGTH.retroText) : existing.keep,
      problem:
        patch.problem !== undefined
          ? trim(patch.problem, TEXT_MAX_LENGTH.retroText)
          : existing.problem,
      try_:
        patch.try_ !== undefined ? trim(patch.try_, TEXT_MAX_LENGTH.retroText) : existing.try_,
    };
    return { ...s, retros: { ...s.retros, [key]: next } };
  });
  revalidate();
  return ok();
}

/* ─── Member ─────────────────────────────────────────────── */
export async function addMember(name: string): Promise<ActionResult<{ mid: string }>> {
  const trimmed = trim(name, TEXT_MAX_LENGTH.memberName);
  if (!trimmed) return err('이름을 입력하세요.');

  const state = await readState();
  let baseId = slugify(trimmed) || `m-${Date.now()}`;
  let mid = baseId;
  let i = 2;
  while (state.members.some((m) => m.id === mid)) {
    mid = `${baseId}-${i++}`;
  }

  await mutateState((s) => ({
    ...s,
    members: [...s.members, { id: mid, name: trimmed }],
  }));
  revalidate();
  return ok({ mid });
}

export async function deleteMember(mid: string): Promise<ActionResult> {
  await mutateState((s) => {
    const nextKrs: typeof s.krs = {};
    for (const [kid, wrapper] of Object.entries(s.krs)) {
      nextKrs[kid] = {
        ...wrapper,
        data: { ...wrapper.data, owners: wrapper.data.owners.filter((o) => o !== mid) },
      };
    }
    const nextRetros = { ...s.retros };
    for (const key of Object.keys(nextRetros)) {
      if (key.endsWith(`:${mid}`)) delete nextRetros[key];
    }
    return { ...s, members: s.members.filter((m) => m.id !== mid), krs: nextKrs, retros: nextRetros };
  });
  revalidate();
  return ok();
}

/* ─── Seed / Reset / Export / Import (server-side) ─────── */
export async function loadSampleDataAction(): Promise<ActionResult> {
  const { sampleState } = await import('@/lib/seed');
  await writeState(sampleState);
  revalidate();
  return ok();
}

export async function resetDataAction(): Promise<ActionResult> {
  const { resetState } = await import('@/lib/storage');
  await resetState();
  revalidate();
  return ok();
}

export async function exportJsonAction(): Promise<ActionResult<{ json: string }>> {
  const { exportJson } = await import('@/lib/storage');
  return ok({ json: await exportJson() });
}

export async function importJsonAction(json: string): Promise<ActionResult> {
  const { importJson } = await import('@/lib/storage');
  const r = await importJson(json);
  if (!r.ok) return err(r.error);
  revalidate();
  return ok();
}

/* Final Score 자동 평가는 KR 데이터로 파생되므로 별도 액션 없음 */
export async function updateFinalScore(): Promise<ActionResult> {
  return err('점수표는 자동 평가로 변경되어 직접 수정이 불가합니다.');
}
