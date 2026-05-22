import {
  ACHIEVED_RATIO_COLOR_THRESHOLDS,
  ACHIEVEMENT_THRESHOLDS,
  CONFIDENCE_SCORE,
  PROGRESS_COLOR_THRESHOLDS,
} from './constants';
import type { Confidence, KR, KRDisplayStatus, StatusColor } from './types';

export function progressColor(progress: number, hasUpdate: boolean): StatusColor {
  if (!hasUpdate && progress === 0) return 'idle';
  if (progress >= PROGRESS_COLOR_THRESHOLDS.success) return 'success';
  if (progress >= PROGRESS_COLOR_THRESHOLDS.warning) return 'warning';
  return 'danger';
}

export function isKRAchieved(kr: KR): boolean {
  const threshold = ACHIEVEMENT_THRESHOLDS[kr.type];
  return kr.progress >= threshold;
}

export function krDisplayStatus(kr: KR): KRDisplayStatus {
  if (!kr.updated_at && kr.progress === 0) return 'idle';
  if (isKRAchieved(kr)) return 'done';
  if (kr.progress < PROGRESS_COLOR_THRESHOLDS.warning || kr.confidence === 'low') return 'risk';
  return 'normal';
}

export function quarterProgress(start: string, end: string, now: Date = new Date()): number {
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  const nowMs = now.getTime();
  if (endMs <= startMs) return 0;
  return Math.max(0, Math.min(1, (nowMs - startMs) / (endMs - startMs)));
}

export function weeksRemaining(end: string, now: Date = new Date()): number {
  const diff = Date.parse(end) - now.getTime();
  return Math.max(0, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
}

export function currentWeek(start: string, now: Date = new Date()): number {
  const diff = now.getTime() - Date.parse(start);
  return Math.max(1, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
}

function getMondayMidnight(now: Date): Date {
  const d = new Date(now);
  const day = d.getDay(); // 0=Sun, 1=Mon
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function thisWeekUpdateRate(
  krs: KR[],
  now: Date = new Date()
): { done: number; total: number } {
  const monday = getMondayMidnight(now);
  const done = krs.filter(
    (kr) => kr.updated_at && Date.parse(kr.updated_at) >= monday.getTime()
  ).length;
  return { done, total: krs.length };
}

export function avgProgress(krs: KR[]): number {
  if (krs.length === 0) return 0;
  return krs.reduce((s, k) => s + k.progress, 0) / krs.length;
}

export function doneCount(krs: KR[]): { done: number; total: number } {
  const done = krs.filter((kr) => isKRAchieved(kr)).length;
  return { done, total: krs.length };
}

export function avgConfidence(krs: KR[]): Confidence {
  if (krs.length === 0) return 'mid';
  const avg =
    krs.reduce((s, k) => s + CONFIDENCE_SCORE[k.confidence], 0) / krs.length;
  if (avg >= 2.5) return 'high';
  if (avg >= 1.5) return 'mid';
  return 'low';
}

export function achievedRatioColor(done: number, total: number): StatusColor {
  if (total === 0) return 'idle';
  const ratio = done / total;
  if (ratio >= ACHIEVED_RATIO_COLOR_THRESHOLDS.success) return 'success';
  if (ratio >= ACHIEVED_RATIO_COLOR_THRESHOLDS.warning) return 'warning';
  return 'danger';
}

export function confidenceColor(c: Confidence): StatusColor {
  if (c === 'high') return 'success';
  if (c === 'mid') return 'warning';
  return 'danger';
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
