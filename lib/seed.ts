'use client';

import { writeState, type StorageState } from './storage';

export function loadSampleData(): void {
  const now = new Date().toISOString();
  const state: StorageState = {
    quarters: {
      '26q2': {
        id: '26q2',
        name: '26.Q2',
        start_date: '2026-04-01',
        end_date: '2026-06-30',
        status: 'active',
      },
    },
    quartersOrder: ['26q2'],
    objectives: {
      O1: {
        quarter_id: '26q2',
        data: {
          id: 'O1',
          title: '사업과제·오픈 이노베이션(OI)에서 신규 수주를 확보한다',
        },
      },
      O2: {
        quarter_id: '26q2',
        data: {
          id: 'O2',
          title: '본격적인 국내 및 해외 시장 진입을 위한 외부 활동을 운영한다',
        },
      },
    },
    objectivesOrder: {
      '26q2': ['O1', 'O2'],
    },
    krs: {
      'O1-KR1': {
        quarter_id: '26q2',
        data: {
          id: 'O1-KR1',
          objective_id: 'O1',
          type: 'Aspire',
          owners: ['benjamin', 'ria', 'que'],
          target_text: '응모·제안서 10건 제출 및 선정율 50% 확보',
          current_value: 0,
          current_detail: '',
          progress: 0,
          confidence: 'mid',
          updated_at: null,
        },
      },
      'O1-KR2': {
        quarter_id: '26q2',
        data: {
          id: 'O1-KR2',
          objective_id: 'O1',
          type: 'Aspire',
          owners: ['ria'],
          target_text: '수주 소요 일정을 기존 대비 50% 단축',
          current_value: 0,
          current_detail: '',
          progress: 0,
          confidence: 'mid',
          updated_at: null,
        },
      },
      'O1-KR3': {
        quarter_id: '26q2',
        data: {
          id: 'O1-KR3',
          objective_id: 'O1',
          type: 'Aspire',
          owners: ['que'],
          target_text: '오픈 이노베이션 파트너 3개사 신규 발굴 (Q3 진입 2사)',
          current_value: 1,
          current_detail: '호반',
          progress: 0.03,
          confidence: 'low',
          updated_at: now,
        },
      },
      'O2-KR1': {
        quarter_id: '26q2',
        data: {
          id: 'O2-KR1',
          objective_id: 'O2',
          type: 'Aspire',
          owners: ['que', 'monica'],
          target_text: '박람회를 통한 고객과의 후속 논의 3건',
          current_value: 2,
          current_detail: 'IBK100-다날, IBK100-SBVA',
          progress: 0.06,
          confidence: 'mid',
          updated_at: now,
        },
      },
      'O2-KR2': {
        quarter_id: '26q2',
        data: {
          id: 'O2-KR2',
          objective_id: 'O2',
          type: 'Aspire',
          owners: ['que', 'monica'],
          target_text: '국문 또는 영문 Pitch 진행 후 후속 미팅 3건 확보',
          current_value: 1,
          current_detail: '오사카',
          progress: 0.03,
          confidence: 'low',
          updated_at: now,
        },
      },
    },
    krsOrder: {
      '26q2:O1': ['O1-KR1', 'O1-KR2', 'O1-KR3'],
      '26q2:O2': ['O2-KR1', 'O2-KR2'],
    },
    finalScores: {},
    retros: {},
    members: [
      { id: 'benjamin', name: 'Benjamin' },
      { id: 'ria', name: 'Ria' },
      { id: 'que', name: 'Que' },
      { id: 'monica', name: 'Monica' },
    ],
  };
  writeState(state);
}
