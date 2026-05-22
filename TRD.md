# 사업전략팀 OKR 대시보드 TRD (Technical Requirements Document)

- **버전**: v1.0
- **작성일**: 2026-05-22
- **연계 문서**: [PRD.md](PRD.md), [IA.md](IA.md), [Workflow.md](Workflow.md)

---

## 0. 한 줄 요약

Next.js (App Router) + Vercel KV로 구성된 단일 페이지 OKR 대시보드. 인증 없는 링크 공유, 서버 액션 기반 데이터 변경, 브라우저 인쇄 API 기반 PDF 출력.

---

## 1. 기술 스택

| 영역 | 선택 | 근거 |
|---|---|---|
| 프레임워크 | **Next.js 14+ (App Router)** | Vercel 네이티브, 서버 컴포넌트로 초기 로드 최적화, Server Actions로 API 라우트 최소화 |
| 언어 | **TypeScript** | 타입 안정성, 데이터 모델 일관성 보장 |
| 스타일 | **Tailwind CSS** | 색상 시스템·반응형 인쇄 CSS 작성 용이 |
| 데이터 저장소 | **Vercel KV** (Upstash Redis 기반) | PRD에서 확정. Vercel 통합 간단 |
| 차트·게이지 | **자체 SVG·CSS 구현** | PRD §12 A2 — 외부 차트 라이브러리 미사용 (번업·도넛 제거로 불필요) |
| 폰트 | **Pretendard** 또는 **Noto Sans KR** | 한글 가독성, PDF 출력 호환 |
| PDF 출력 | **`window.print()` + 인쇄용 CSS** | PRD §12 A1. 별도 PDF 라이브러리 미사용 |
| 배포 | **Vercel** | KV 통합, 자동 CI/CD |
| 패키지 매니저 | **pnpm** [가정] | 빠른 설치, Vercel 호환 |
| 노드 버전 | **Node 20 LTS** [가정] | Vercel 권장 |

---

## 2. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                       사용자 브라우저                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js Client                                      │   │
│  │  ├─ Server Components (초기 렌더, KV 데이터 페치)     │   │
│  │  ├─ Client Components (인라인 편집·모달·인터랙션)    │   │
│  │  └─ Server Actions 호출 (mutate)                     │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js Runtime (Serverless Functions)              │   │
│  │  ├─ /  (page.tsx, RSC)                               │   │
│  │  ├─ Server Actions                                   │   │
│  │  │   ├─ updateKR()                                   │   │
│  │  │   ├─ createQuarter()                              │   │
│  │  │   ├─ addMember()                                  │   │
│  │  │   ├─ deleteKR() / deleteObjective() / ...         │   │
│  │  │   └─ updateScore() / updateRetro()                │   │
│  │  └─ KV 클라이언트 (`@vercel/kv`)                      │   │
│  └─────────────────────┬───────────────────────────────┘   │
│                        │                                     │
│                        ▼                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Vercel KV (Upstash Redis)                           │   │
│  │  키 스키마 — TRD §4 참조                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**아키텍처 핵심 결정**
- 단일 페이지(`app/page.tsx`), URL 파라미터(`?q={qid}`)로 분기 전환
- 초기 로드는 **Server Component**에서 KV 데이터 페치 → SSR (빠른 첫 화면)
- 변경 작업은 **Server Actions** 사용 → API 라우트 별도 정의 불필요
- 클라이언트는 React 상태로 낙관적 업데이트(optimistic update) [가정]

---

## 3. 디렉토리 구조

```
/
├─ app/
│  ├─ layout.tsx                # 전역 레이아웃 (폰트, 테마)
│  ├─ page.tsx                  # 메인 대시보드 (Server Component)
│  ├─ globals.css               # Tailwind + 인쇄용 CSS
│  └─ actions.ts                # Server Actions
│
├─ components/
│  ├─ header/
│  │  ├─ GlobalHeader.tsx       # [A]
│  │  ├─ QuarterSelector.tsx
│  │  └─ ActionButtons.tsx
│  ├─ meta/
│  │  └─ QuarterMetaBar.tsx     # [B]
│  ├─ hero/
│  │  ├─ HeroSummary.tsx        # [C]
│  │  └─ HeroCard.tsx
│  ├─ tree/
│  │  ├─ OKRTree.tsx            # [D]
│  │  ├─ ObjectiveSection.tsx   # [D-1]
│  │  └─ KRCard.tsx             # [D-2]
│  ├─ score/
│  │  └─ ScoreTable.tsx         # [E]
│  ├─ retro/
│  │  └─ KPTSection.tsx         # [F]
│  ├─ modal/
│  │  ├─ ModalContainer.tsx
│  │  ├─ NewQuarterModal.tsx    # M-1
│  │  ├─ MemberManageModal.tsx  # M-2
│  │  └─ ConfirmDialog.tsx      # M-3
│  └─ ui/                       # 재사용 UI primitives
│     ├─ ProgressBar.tsx
│     ├─ ConfidenceLight.tsx
│     ├─ StatusBadge.tsx
│     ├─ TypeBadge.tsx
│     ├─ OwnerChip.tsx
│     ├─ Toast.tsx
│     └─ EmptyState.tsx
│
├─ lib/
│  ├─ kv.ts                     # KV 클라이언트 래퍼 + 키 빌더
│  ├─ types.ts                  # 데이터 타입 정의
│  ├─ calc.ts                   # 진척도·경과율 등 계산 함수
│  └─ constants.ts              # 임계값, 색상 등
│
├─ public/
│  └─ fonts/                    # Pretendard 등
│
├─ next.config.js
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

---

## 4. 데이터 모델

### 4-1. 타입 정의 (`lib/types.ts`)

```typescript
export type QuarterStatus = 'active' | 'archived';
export type KRType = 'Commit' | 'Aspire';
export type Confidence = 'high' | 'mid' | 'low';

export interface Quarter {
  id: string;              // "26Q2"
  name: string;            // "26.Q2"
  start_date: string;      // ISO date "2026-04-01"
  end_date: string;        // ISO date "2026-06-30"
  status: QuarterStatus;
}

export interface Objective {
  id: string;              // "O1"
  title: string;           // "신규 수주를 확보한다"
}

export interface KR {
  id: string;              // "O1-KR1"
  objective_id: string;    // "O1"
  type: KRType;
  owners: string[];        // member ids
  target_text: string;     // "응모·제안서 10건"
  current_value: number;   // 3
  current_detail: string;  // "호반, IBK-다날, SBVA"
  progress: number;        // 0.0 ~ 1.0+ (내부 저장은 0~1 실수, UI는 %)
  confidence: Confidence;
  updated_at: string;      // ISO datetime
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
  id: string;              // 이름 슬러그 또는 UUID
  name: string;            // 표시명
}
```

### 4-2. Vercel KV 키 스키마

| 키 패턴 | 값 형식 | 비고 |
|---|---|---|
| `quarters:list` | `string[]` (분기 ID 배열) | 정렬: 최신이 앞 |
| `quarter:{qid}` | `Quarter` JSON | |
| `quarter:{qid}:objectives` | `string[]` (Objective ID 배열) | 정렬: 생성 순 |
| `quarter:{qid}:objective:{oid}` | `Objective` JSON | |
| `quarter:{qid}:objective:{oid}:krs` | `string[]` (KR ID 배열) | 정렬: 생성 순 |
| `quarter:{qid}:kr:{kid}` | `KR` JSON | |
| `quarter:{qid}:final_score:{kid}` | `FinalScore` JSON | |
| `quarter:{qid}:retro:{mid}` | `Retro` JSON | |
| `members:list` | `Member[]` JSON | 한 키에 멤버 전체 배열 |

> **불변식**:
> - `quarters:list`에는 active 분기 1개와 다수의 archived 분기가 있을 수 있다
> - active 분기는 동시에 1개만 존재 (Server Action에서 보장)
> - KR의 `objective_id`는 같은 분기 내의 Objective ID와 일치해야 한다

### 4-3. KV 작업 패턴 (`lib/kv.ts`)

```typescript
// 키 빌더
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

// 분기 전체 데이터 페치 (초기 로드용 — 파이프라인으로 1 RTT 처리 목표)
export async function getQuarterBundle(qid: string): Promise<QuarterBundle> { ... }

// KR 단건 갱신
export async function updateKR(qid: string, kid: string, patch: Partial<KR>): Promise<void> { ... }

// ... (이하 §5 Server Actions 매핑)
```

> **성능 주의**: `getQuarterBundle`은 KV `pipeline()` 또는 `multi()`로 모든 키를 한 번에 페치한다. RTT 최소화가 중요.

---

## 5. Server Actions (API 계약)

모든 변경 작업은 Server Actions로 구현. API 라우트는 사용하지 않는다.

| Action | 시그니처 | KV 작업 | 반환 |
|---|---|---|---|
| `getQuarterBundle(qid?)` | qid 미지정 시 active 분기 | 다건 read (pipeline) | `QuarterBundle` |
| `createQuarter(input)` | `{name, start_date, end_date}` | 기존 active → archived 전환, 신규 quarter 생성, `quarters:list` push | `{qid}` |
| `createObjective(qid, title)` | | KV write + `objectives` 리스트 push | `{oid}` |
| `updateObjective(qid, oid, patch)` | | KV write | `void` |
| `deleteObjective(qid, oid)` | | 산하 KR 모두 삭제, Objective 삭제, 리스트에서 제거 | `void` |
| `createKR(qid, oid, input)` | `{type, owners, target_text}` 등 | KV write + `krs` 리스트 push | `{kid}` |
| `updateKR(qid, kid, patch)` | | KV write (`updated_at` 자동 설정) | `void` |
| `deleteKR(qid, kid)` | | KV delete + 리스트 제거 | `void` |
| `updateFinalScore(qid, kid, input)` | | KV write | `void` |
| `updateRetro(qid, mid, input)` | | KV write | `void` |
| `addMember(name)` | | `members:list` 업데이트 | `{mid}` |
| `deleteMember(mid)` | | `members:list` 업데이트 + 모든 KR의 owners에서 제거 [PRD W2 권장 (a)] | `void` |

### 5-1. Server Action 표준 패턴

```typescript
'use server';

export async function updateKR(
  qid: string,
  kid: string,
  patch: Partial<KR>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    // 1. 활성 분기 확인 — archived면 거부
    const quarter = await kv.get<Quarter>(k.quarter(qid));
    if (!quarter || quarter.status !== 'active') {
      return { ok: false, error: '활성 분기가 아닙니다.' };
    }
    // 2. 기존 KR 로드 + patch 적용 + updated_at 자동 갱신
    const existing = await kv.get<KR>(k.kr(qid, kid));
    if (!existing) {
      return { ok: false, error: 'KR을 찾을 수 없습니다.' };
    }
    const updated: KR = {
      ...existing,
      ...patch,
      updated_at: new Date().toISOString(),
    };
    // 3. KV 저장
    await kv.set(k.kr(qid, kid), updated);
    // 4. 캐시 무효화
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: '저장 실패' };
  }
}
```

### 5-2. 멱등성·트랜잭션
- KV에는 트랜잭션이 약하므로 **마지막 저장 우선** 정책으로 단순화 (PRD §10)
- 분기 생성 같은 다중 키 변경은 KV `multi()` (Redis MULTI/EXEC) 사용 권장

---

## 6. 프론트엔드 아키텍처

### 6-1. 렌더링 전략

| 컴포넌트 | 타입 | 이유 |
|---|---|---|
| `app/page.tsx` | **Server Component** | 초기 KV 데이터 페치 (SSR) |
| `GlobalHeader`, `QuarterMetaBar`, `HeroSummary`, `OKRTree` | Server Component | 정적 렌더 가능 |
| `KRCard`, `ScoreTable`, `KPTSection` | **Client Component** | 인라인 편집 인터랙션 필요 |
| `Modal*` | Client Component | open/close 상태 |
| `QuarterSelector` | Client Component | URL 변경 트리거 |

### 6-2. 상태 관리

- 전역 상태 라이브러리(Redux, Zustand 등) **사용하지 않음**
- 서버 데이터는 Server Component에서 페치하여 props로 전달
- 클라이언트 인터랙션 상태는 각 컴포넌트의 `useState`로 충분
- 저장 후 데이터 갱신은 `revalidatePath('/')` + Next.js Router refresh

### 6-3. 낙관적 업데이트 [가정]

매주 갱신 UX 개선을 위해 KR 저장은 낙관적 업데이트 적용:
1. UI에 변경값 즉시 반영
2. Server Action 호출
3. 성공 시 Router refresh (서버 데이터로 정합화)
4. 실패 시 이전 값으로 롤백 + 에러 토스트

---

## 7. 색상 시스템 구현

PRD §9-4의 색상 임계값을 Tailwind 토큰으로 매핑.

### 7-1. Tailwind 설정 (`tailwind.config.ts`)

```typescript
theme: {
  extend: {
    colors: {
      status: {
        success: '#22C55E',   // 초록
        warning: '#EAB308',   // 노랑
        danger:  '#EF4444',   // 빨강
        idle:    '#9CA3AF',   // 회색
      },
      type: {
        commit: '#3B82F6',    // 파랑
        aspire: '#A855F7',    // 보라
      },
    },
  },
},
```

### 7-2. 색상 결정 함수 (`lib/calc.ts`)

```typescript
export function progressColor(progress: number, hasUpdate: boolean): 'success'|'warning'|'danger'|'idle' {
  if (!hasUpdate && progress === 0) return 'idle';
  if (progress >= 0.6) return 'success';
  if (progress >= 0.3) return 'warning';
  return 'danger';
}

export function krStatus(kr: KR): 'done' | 'risk' | 'normal' {
  const isDone =
    (kr.type === 'Commit' && kr.progress >= 1.0) ||
    (kr.type === 'Aspire' && kr.progress >= 0.6);
  if (isDone) return 'done';                                // 우선순위: 달성 > 위험
  if (kr.progress < 0.3 || kr.confidence === 'low') return 'risk';
  return 'normal';
}
```

> 모든 시각 요소(진척도 바, Hero 카드, 좌측 띠, 상태 배지)는 위 두 함수의 결과만 본다. 색상 임계값이 한 곳에서만 관리되도록 강제.

---

## 8. PDF 출력 구현

### 8-1. 트리거

```typescript
function handlePrintClick() {
  window.print();
}
```

### 8-2. 인쇄용 CSS (`app/globals.css`)

```css
@media print {
  /* 숨길 요소 — IA §9 */
  .no-print,
  .global-header__actions,
  .delete-button,
  .add-button,
  .edit-input {
    display: none !important;
  }

  /* 페이지 끊김 규칙 */
  .objective-section { break-inside: avoid; }
  .kr-card { break-inside: avoid; }
  .hero-summary { break-after: page; }

  /* 색상 강제 출력 */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* A4 세로 */
  @page {
    size: A4 portrait;
    margin: 16mm;
  }
}
```

### 8-3. 인쇄 모드에서 숨길 요소 (IA §9)

| 요소 | 클래스 |
|---|---|
| 헤더 액션 버튼 | `.global-header__actions` |
| 삭제 ✕ 버튼 | `.delete-button` |
| + 추가 버튼 | `.add-button` |
| 인라인 편집 입력란 (편집 모드일 때) | `.edit-input` |

---

## 9. 자동 계산 로직 (`lib/calc.ts`)

PRD §9-3 계산식을 함수로 구현. 모든 시간 계산은 **로컬 타임존(KST)** 기준 [가정].

```typescript
export function quarterProgress(start: string, end: string, now = new Date()): number {
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  const nowMs = now.getTime();
  return Math.max(0, Math.min(1, (nowMs - startMs) / (endMs - startMs)));
}

export function weeksRemaining(end: string, now = new Date()): number {
  const diff = Date.parse(end) - now.getTime();
  return Math.max(0, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
}

export function currentWeek(start: string, now = new Date()): number {
  const diff = now.getTime() - Date.parse(start);
  return Math.max(1, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
}

export function thisWeekUpdateRate(krs: KR[], now = new Date()): { done: number; total: number } {
  // 이번 주 월요일 0시(KST) 계산
  const monday = getMondayMidnight(now);
  const done = krs.filter(kr => Date.parse(kr.updated_at) >= monday.getTime()).length;
  return { done, total: krs.length };
}

export function avgProgress(krs: KR[]): number {
  if (krs.length === 0) return 0;
  return krs.reduce((s, k) => s + k.progress, 0) / krs.length;
}

export function doneCount(krs: KR[]): number {
  return krs.filter(kr => krStatus(kr) === 'done').length;
}

export function avgConfidence(krs: KR[]): Confidence {
  if (krs.length === 0) return 'mid';
  const scoreMap = { high: 3, mid: 2, low: 1 } as const;
  const avg = krs.reduce((s, k) => s + scoreMap[k.confidence], 0) / krs.length;
  if (avg >= 2.5) return 'high';
  if (avg >= 1.5) return 'mid';
  return 'low';
}
```

---

## 10. 배포 (Vercel)

### 10-1. 환경 변수

| 변수 | 출처 | 비고 |
|---|---|---|
| `KV_URL` | Vercel KV 통합 시 자동 주입 | |
| `KV_REST_API_URL` | 동일 | |
| `KV_REST_API_TOKEN` | 동일 | |
| `KV_REST_API_READ_ONLY_TOKEN` | 동일 | 사용 안 함 |

### 10-2. 배포 절차
1. Vercel 프로젝트 생성, GitHub 연동
2. Vercel Storage → KV 인스턴스 생성, 프로젝트에 연결
3. `main` 브랜치 푸시 → 자동 빌드·배포
4. 도메인 발급 (기본 `*.vercel.app` 또는 커스텀 도메인)

### 10-3. 빌드 설정
- Framework: Next.js (자동 감지)
- Build Command: `pnpm build`
- Install Command: `pnpm install`
- Output: 기본값 (`.next`)

---

## 11. 성능 고려사항

| 항목 | 전략 |
|---|---|
| 초기 로드 | Server Component에서 KV `pipeline()`로 분기 전체 데이터를 1 RTT에 페치 |
| 캐시 | Next.js 기본 캐시 활용. 변경 시 `revalidatePath('/')`로 무효화 |
| 분기 전환 | URL 파라미터 변경 → Server Component 재실행. 클라이언트 캐시는 분기별로 자연 분리 |
| 이미지 | 사용하지 않음 (아이콘은 SVG 인라인) |
| 폰트 | `next/font`로 self-hosted Pretendard, FOUT/FOIT 최소화 |
| KV 호출 수 | 분기 1개 페치 = 약 7~15개 키 (Quarter + Objectives + KRs + Scores + Retros + Members). 파이프라인 필수 |

---

## 12. 보안

### 12-1. 인증·인가
- **인증 없음**. 링크 보유자 전원 접근 가능 (PRD §10 확정)
- 별도 인가 체크 없음

### 12-2. KV 키 보호
- KV 접근은 **서버 사이드만** (Server Component, Server Actions)
- 클라이언트에 KV 토큰 노출 금지
- `NEXT_PUBLIC_*` 환경변수에 KV 관련 값 절대 두지 않음

### 12-3. 입력 검증
- Server Action 진입 시 모든 입력 길이·타입 검증
- 텍스트 필드 최대 길이 [가정]
  - target_text, current_detail, result_text, evaluation: 500자
  - keep/problem/try: 1000자
  - 분기명, Objective 제목, KR 목표: 200자
  - 멤버 이름: 50자
- HTML 이스케이프 (React 기본 동작에 의존)

### 12-4. CSRF
- Server Actions는 Next.js가 기본 CSRF 보호 제공

---

## 13. 에러 처리

### 13-1. 에러 분류

| 분류 | 예시 | 사용자 경험 |
|---|---|---|
| 입력 검증 실패 | 빈 분기명 입력 | 모달/폼 내 인라인 메시지 |
| KV 일시 장애 | 네트워크 timeout | 토스트 "저장 실패. 다시 시도하세요" + 입력값 유지 |
| 상태 불일치 | 아카이브 분기에 쓰기 시도 | 토스트 "활성 분기가 아닙니다" |
| 알 수 없는 오류 | 예상 못한 예외 | 토스트 "오류가 발생했습니다" |

### 13-2. 에러 표준 형식

```typescript
type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };
```

모든 Server Action은 이 형식으로 반환. 예외는 내부에서 catch.

### 13-3. 토스트 위치
- 화면 우상단 (WF §7 WF7)
- 성공 토스트 2초, 에러 토스트 4초 [가정]

---

## 14. 테스팅 전략

### 14-1. 우선순위
| 우선 | 대상 | 도구 |
|---|---|---|
| **High** | 계산 함수 (`lib/calc.ts`) — 진척도·경과율·달성 판정 | Vitest 단위 테스트 |
| **High** | Server Actions — 활성 분기 보호, 데이터 일관성 | Vitest + KV 모킹 |
| Medium | KR 카드 인라인 편집 흐름 | Playwright e2e |
| Medium | 분기 생성·전환 흐름 | Playwright e2e |
| Low | 시각 요소 (색상 매핑) | 시각 회귀 테스트 (Chromatic 등) — 1차 범위 외 |

### 14-2. 핵심 검증 케이스 (PRD AC-01 ~ AC-15 매핑)

각 AC는 단위 또는 e2e 테스트로 1:1 매핑.
- AC-01 (분기 메타) → `quarterProgress`, `weeksRemaining` 단위 테스트
- AC-03~06 (인라인 편집·달성 라벨) → `krStatus` 단위 + e2e
- AC-12 (PDF) → e2e에서 `window.print` 모킹 호출 검증
- AC-13 (영속화) → e2e에서 KV에 저장된 값 직접 확인

---

## 15. 모니터링 & 로깅

| 항목 | 도구 | 비고 |
|---|---|---|
| 배포·런타임 에러 | Vercel 기본 로그 | 별도 도구 추가 없음 (MVP 범위) |
| KV 사용량 | Vercel Storage 대시보드 | 무료 한도 모니터링 |
| 사용자 액션 로그 | **수집하지 않음** | PRD에서 편집 이력 미보관 확정 |

---

## 16. 향후 확장 포인트 (out of scope, but consider)

이번 버전에서는 구현하지 않지만, 코드 설계 시 막지 않도록 고려:
- **인증 추가**: Next.js Middleware로 라우트 가드 가능하게 컴포넌트 분리
- **회사 OKR 연결**: KR 타입에 `parent_company_kr_id?` 필드 추가 여지
- **모바일 레이아웃**: Tailwind 반응형 클래스 미리 활용 가능하나 1차 미사용
- **알림**: Server Action 호출 시점에 webhook 추가 가능 (Slack 등)
- **편집 이력**: KV 키 `quarter:{qid}:kr:{kid}:history`로 시계열 보관 가능 (지금은 미수집)

---

## 17. 가정 및 결정 필요 사항

| # | 항목 | 가정 / 결정 필요 |
|---|---|---|
| T1 | 패키지 매니저 | pnpm [가정]. 팀 표준에 따라 npm·yarn으로 변경 가능 |
| T2 | Node 버전 | 20 LTS [가정] |
| T3 | 낙관적 업데이트 적용 범위 | KR 갱신에만 적용. 분기 생성·멤버 변경은 동기 [가정] |
| T4 | 시간대 | 모든 계산을 KST(Asia/Seoul) 기준 [가정]. 다른 시간대 사용자 미고려 |
| T5 | 텍스트 필드 최대 길이 | §12-3 가정 — 별도 확인 필요 시 사용 |
| T6 | 토스트 노출 시간 | 성공 2초, 에러 4초 [가정] |
| T7 | KV 무료 한도 초과 시 대응 | Upstash 유료 전환 또는 다른 저장소 마이그레이션 — 운영 정책 결정 필요 |
| T8 | 동시 편집 충돌 가시화 | 미구현 (PRD에서 제거). KV 사용량 모니터링 중 충돌 패턴 보이면 재검토 |
| T9 | 멤버 ID 생성 방식 | 이름 슬러그 기반(`benjamin`, `ria`). 중복 시 suffix 추가 [가정] |
| T10 | KR/Objective ID 생성 방식 | 분기 내 순번 기반(`O1`, `O1-KR1`). 삭제 후에도 번호는 재사용하지 않음 [가정] |

---

## 18. 구현 체크리스트 (요약)

신규 개발자가 처음 환경 구성할 때 참고:

- [ ] Vercel 프로젝트 생성 + KV 인스턴스 연결
- [ ] Next.js 14 + TypeScript + Tailwind 초기화
- [ ] Pretendard 폰트 self-hosted 설정 (`next/font/local`)
- [ ] `lib/types.ts`, `lib/kv.ts`, `lib/calc.ts`, `lib/constants.ts` 작성
- [ ] Server Actions 12종 구현 (§5)
- [ ] 컴포넌트 트리 구축 (§3)
- [ ] 색상 토큰 + 색상 결정 함수 통합 (§7)
- [ ] 인쇄용 CSS 작성 (§8)
- [ ] 자동 계산 함수 단위 테스트 (§14)
- [ ] e2e 시나리오 5개(매주 갱신, 새 분기, 멤버 관리, PDF, 과거 분기 조회)
- [ ] 배포 + 도메인 연결
