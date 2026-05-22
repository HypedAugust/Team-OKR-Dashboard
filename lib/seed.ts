import 'server-only';
import type { StorageState } from './storage';

// PDF: 26.Q2 사업전략팀 OKR 트래킹 (작성일 2026.05.22)
const date0512 = '2026-05-12T09:00:00+09:00';
const date0515 = '2026-05-15T09:00:00+09:00';

export const sampleState: StorageState = {
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
        target_text:
          '응모·제안서 10건 제출 / 선정율 50% / 4억 원 수주 목표의 3배수 이상 파이프라인 확보',
        target_value: 10,
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
        target_text: 'AX 도입으로 신규 수주 소요 일정을 기존 대비 50% 단축',
        target_value: null,
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
        target_text:
          'OI 파트너 3사 신규 발굴 / Q3에 2사 영업팀과 공동 클로징 진입',
        target_value: 3,
        current_value: 1,
        current_detail: '호반',
        progress: 1 / 3,
        confidence: 'low',
        updated_at: null,
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
        target_value: 3,
        current_value: 2,
        current_detail: 'IBK100-다날 / IBK100-SBVA',
        progress: 2 / 3,
        confidence: 'mid',
        updated_at: date0512,
      },
    },
    'O2-KR2': {
      quarter_id: '26q2',
      data: {
        id: 'O2-KR2',
        objective_id: 'O2',
        type: 'Aspire',
        owners: ['que', 'monica'],
        target_text: '국문/영문 Pitch 후속 미팅 3건 확보',
        target_value: 3,
        current_value: 1,
        current_detail: '오사카',
        progress: 1 / 3,
        confidence: 'low',
        updated_at: date0515,
      },
    },
    'O2-KR3': {
      quarter_id: '26q2',
      data: {
        id: 'O2-KR3',
        objective_id: 'O2',
        type: 'Aspire',
        owners: [],
        target_text: '컨플루언스 갱신 / 외부 발표 3회',
        target_value: 3,
        current_value: 0,
        current_detail: '',
        progress: 0,
        confidence: 'mid',
        updated_at: null,
      },
    },
  },
  krsOrder: {
    '26q2:O1': ['O1-KR1', 'O1-KR2', 'O1-KR3'],
    '26q2:O2': ['O2-KR1', 'O2-KR2', 'O2-KR3'],
  },
  finalScores: {},
  retros: {
    '26q2:que': {
      member_id: 'que',
      keep: '',
      problem:
        'initiative와 KR을 구분하지 못했다. 어떤 행동을 해서 어떤 임팩트를 낼 것인지 작성했어야 한다.\n예) 전: 박람회 3건 운영 → 후: 박람회를 통한 고객과의 후속 논의 3건',
      try_: '',
    },
  },
  members: [
    { id: 'benjamin', name: 'Benjamin' },
    { id: 'ria', name: 'Ria' },
    { id: 'que', name: 'Que' },
    { id: 'monica', name: 'Monica (이가원)' },
  ],
};
