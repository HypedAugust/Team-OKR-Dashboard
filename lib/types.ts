export type QuarterStatus = 'active' | 'archived';
export type KRType = 'Commit' | 'Aspire';
export type Confidence = 'high' | 'mid' | 'low';
export type StatusColor = 'success' | 'warning' | 'danger' | 'idle';
export type KRDisplayStatus = 'done' | 'risk' | 'normal' | 'idle';

export interface Quarter {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: QuarterStatus;
}

export interface Objective {
  id: string;
  title: string;
}

export interface KR {
  id: string;
  objective_id: string;
  type: KRType;
  owners: string[];
  target_text: string;
  target_value: number | null; // 숫자 목표 (있으면 진척도 자동 계산)
  current_value: number;
  current_detail: string;
  progress: number; // 자동 계산값 (target_value > 0이면), 또는 수동 입력
  confidence: Confidence;
  updated_at: string | null;
}

export interface FinalScore {
  kr_id: string;
  result_text: string;
  evaluation: string;
}

export interface Retro {
  member_id: string;
  keep: string;
  problem: string;
  try_: string;
}

export interface Member {
  id: string;
  name: string;
}

export interface QuarterBundle {
  quarter: Quarter | null;
  quartersList: Quarter[];
  objectives: Array<Objective & { krs: KR[] }>;
  finalScores: Record<string, FinalScore>;
  retros: Record<string, Retro>;
  members: Member[];
}
