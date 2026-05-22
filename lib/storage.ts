'use client';

import type {
  FinalScore,
  KR,
  Member,
  Objective,
  Quarter,
  QuarterBundle,
  Retro,
} from './types';

const STORAGE_KEY = 'okr-dashboard-v1';
const CHANGE_EVENT = 'okr-storage-changed';

export interface StorageState {
  quarters: Record<string, Quarter>;
  quartersOrder: string[];
  objectives: Record<string, { quarter_id: string; data: Objective }>;
  objectivesOrder: Record<string, string[]>; // qid → oid[]
  krs: Record<string, { quarter_id: string; data: KR }>;
  krsOrder: Record<string, string[]>; // `${qid}:${oid}` → kid[]
  finalScores: Record<string, FinalScore>; // `${qid}:${kid}` → FinalScore
  retros: Record<string, Retro>; // `${qid}:${mid}` → Retro
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

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function readState(): StorageState {
  if (!isBrowser()) return emptyState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw);
    return { ...emptyState, ...parsed };
  } catch {
    return emptyState;
  }
}

export function writeState(state: StorageState): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function resetState(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function onStorageChange(handler: () => void): () => void {
  if (!isBrowser()) return () => {};
  const listener = () => handler();
  window.addEventListener(CHANGE_EVENT, listener);
  // also pick up changes from other tabs
  const storageListener = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) handler();
  };
  window.addEventListener('storage', storageListener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', storageListener);
  };
}

export function getActiveQuarterId(state: StorageState = readState()): string | null {
  for (const id of state.quartersOrder) {
    const q = state.quarters[id];
    if (q?.status === 'active') return id;
  }
  return state.quartersOrder[0] ?? null;
}

export function getBundle(qid: string | null): QuarterBundle {
  const state = readState();
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

// ─── Mutations ──────────────────────────────────────────────────────────

export function mutate(updater: (s: StorageState) => StorageState): void {
  const current = readState();
  const next = updater(current);
  writeState(next);
}

export function exportJson(): string {
  return JSON.stringify(readState(), null, 2);
}

export function importJson(json: string): { ok: true } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null)
      return { ok: false, error: '잘못된 JSON 형식입니다.' };
    writeState({ ...emptyState, ...parsed });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: `파일 해석 실패: ${e?.message ?? 'unknown'}` };
  }
}
