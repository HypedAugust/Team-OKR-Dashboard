export const ACHIEVEMENT_THRESHOLDS = {
  Commit: 1.0,
  Aspire: 0.6,
} as const;

export const PROGRESS_COLOR_THRESHOLDS = {
  success: 0.6,
  warning: 0.3,
} as const;

export const ACHIEVED_RATIO_COLOR_THRESHOLDS = {
  success: 0.8,
  warning: 0.5,
} as const;

export const TEXT_MAX_LENGTH = {
  quarterName: 20,
  objectiveTitle: 200,
  krTargetText: 200,
  currentDetail: 500,
  finalScoreText: 500,
  retroText: 1000,
  memberName: 50,
} as const;

export const CONFIDENCE_LABEL: Record<'high' | 'mid' | 'low', string> = {
  high: '高',
  mid: '中',
  low: '低',
};

export const CONFIDENCE_SCORE: Record<'high' | 'mid' | 'low', number> = {
  high: 3,
  mid: 2,
  low: 1,
};
