# 사업전략팀 OKR 대시보드 Design System

- **버전**: v1.0
- **작성일**: 2026-05-22
- **연계 문서**: [PRD.md](PRD.md), [IA.md](IA.md), [Workflow.md](Workflow.md), [TRD.md](TRD.md)
- **레퍼런스 톤앤매너**: 모던 핀테크 대시보드 (다크 테마, 볼드 컬러 블록, 큰 숫자 강조)

---

## 0. 디자인 원칙

| 원칙 | 의미 |
|---|---|
| **At-a-Glance** | 3초 안에 분기 상태를 인지할 수 있어야 한다. 큰 숫자 + 색상이 그 도구다 |
| **Bold over Subtle** | 회색조 미묘한 차이가 아니라, 명확한 색 블록으로 상태를 알린다 |
| **Dark by Default** | 다크 테마가 기본. 데이터 색상이 더 선명하게 살아난다 |
| **One Hero Per Page** | 페이지의 시선이 가장 먼저 가는 곳은 Hero Summary 한 곳뿐이다 |
| **Numeric First** | 모든 수치는 큰 활자·tabular 폰트로 표시 |
| **Generous Breathing** | 카드 간 여백을 충분히 두어 정보 과부하 방지 |

---

## 1. 컬러 시스템

### 1-1. Background & Surface

다크 테마. 깊이감은 명도가 아니라 elevation으로 표현.

| 토큰 | HEX | 용도 |
|---|---|---|
| `bg-base` | `#0A0A0B` | 페이지 최하단 배경 |
| `bg-surface-1` | `#141416` | 1단 카드 (KR 카드, Hero 카드) |
| `bg-surface-2` | `#1C1C1F` | 2단 카드 (카드 안의 입력 영역, 모달 배경) |
| `bg-surface-3` | `#252529` | 3단 (호버, 활성 입력 필드) |
| `bg-overlay` | `rgba(0, 0, 0, 0.7)` | 모달 딤 |

### 1-2. Text

| 토큰 | HEX | 용도 |
|---|---|---|
| `text-primary` | `#FFFFFF` | 큰 숫자, 카드 제목 |
| `text-secondary` | `#E5E5E7` | 본문 텍스트 |
| `text-tertiary` | `#9CA3AF` | 라벨, 보조 정보 (예: "Total Profits") |
| `text-muted` | `#6B7280` | placeholder, 비활성 |
| `text-on-color` | `#0A0A0B` | 강조 색상 배경 위 텍스트 (예: Hero 카드 안) |

### 1-3. Status (가장 중요한 색상군)

PRD §9-4 색상 임계값을 다크 테마에 최적화. 채도를 높여 다크 배경에서 더 선명하게.

| 토큰 | HEX | 의미 | 사용 |
|---|---|---|---|
| `status-success` | `#22D37E` | 달성·안정 | 달성 KR, Hero 진척도 ≥60% |
| `status-success-soft` | `#1F3D2D` | 동일 상태의 배경 블록 | 카드 좌측 띠, 배지 배경 |
| `status-warning` | `#F5C043` | 진행 중·주의 | Hero 진척도 30~60% |
| `status-warning-soft` | `#3D3320` | 동일 상태의 배경 블록 | |
| `status-danger` | `#FF5A4A` | 위험 | Hero 진척도 <30%, 신뢰도 低 |
| `status-danger-soft` | `#3D211F` | 동일 상태의 배경 블록 | |
| `status-idle` | `#6B7280` | 미시작·중립 | 갱신 없는 KR |
| `status-idle-soft` | `#252529` | | |

> **소프트 톤**은 카드 좌측 띠와 배지 배경에, **솔리드 톤**은 큰 숫자·아이콘·강조 영역에 사용한다.

### 1-4. Brand & Accent

| 토큰 | HEX | 용도 |
|---|---|---|
| `accent-primary` | `#FF5A4A` | Hero "전체 평균 진척도" 카드의 풀 배경 (레퍼런스의 오렌지 차트 영역 차용). 단, 진척도 상태가 빨강일 때만 사용 |
| `accent-bg-success` | `#1A4030` | 진척도 ≥60%일 때 Hero 카드 풀 배경 |
| `accent-bg-warning` | `#403320` | 진척도 30~60%일 때 Hero 카드 풀 배경 |
| `accent-bg-danger` | `#4A2520` | 진척도 <30%일 때 Hero 카드 풀 배경 |

> Hero "전체 평균 진척도" 카드는 페이지에서 가장 큰 시각 영역으로, 진척도 상태에 따라 풀 배경색이 바뀐다. 레퍼런스 이미지의 오렌지 Portfolio Value 카드에서 영감.

### 1-5. Type Badge

KR 유형(Commit / Aspire) 구분. 상태 색상과 충돌하지 않도록 차가운 톤.

| 토큰 | HEX | 용도 |
|---|---|---|
| `type-commit` | `#5B8DEF` | Commit 배지 텍스트·테두리 |
| `type-commit-soft` | `#1E2A40` | Commit 배지 배경 |
| `type-aspire` | `#B57BFF` | Aspire 배지 텍스트·테두리 |
| `type-aspire-soft` | `#2A1E40` | Aspire 배지 배경 |

### 1-6. Border & Divider

| 토큰 | HEX | 용도 |
|---|---|---|
| `border-subtle` | `#252529` | 카드 테두리 (다크에서 거의 보이지 않음) |
| `border-default` | `#33333A` | 입력 필드 테두리 |
| `border-strong` | `#4A4A52` | 활성 입력 필드, 포커스 |

---

## 2. 타이포그래피

### 2-1. 폰트 스택

```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont,
             'Helvetica Neue', sans-serif;

/* 숫자 전용 */
font-variant-numeric: tabular-nums;
font-feature-settings: 'tnum' 1, 'cv11' 1;
```

> 모든 수치(진척도, 카운트, 날짜)에는 `tabular-nums`를 강제 적용해 자릿수 흔들림 방지.

### 2-2. 타입 스케일

| 토큰 | size / line | weight | 용도 |
|---|---|---|---|
| `display-hero` | 56px / 64px | 700 | Hero 카드 큰 숫자 (예: "42%") |
| `display-md` | 40px / 48px | 700 | 모달 큰 숫자 [확장용] |
| `heading-xl` | 28px / 36px | 700 | 분기명 ("26.Q2") |
| `heading-lg` | 22px / 30px | 600 | Objective 제목 |
| `heading-md` | 18px / 26px | 600 | KR 목표, 카드 제목 |
| `body-lg` | 16px / 24px | 500 | 카드 본문 메인 텍스트 |
| `body-md` | 14px / 22px | 400 | 일반 본문 |
| `body-sm` | 13px / 20px | 400 | 보조 정보 |
| `label-md` | 13px / 18px | 500 | "Total Profits" 같은 카드 라벨 (대문자 권장) |
| `label-sm` | 11px / 16px | 600 | 배지 텍스트 ("Aspire", "위험") |
| `caption` | 12px / 16px | 400 | 갱신일, footnote |

### 2-3. 라벨 스타일

레퍼런스 이미지의 "Total Profits", "Portfolio Value" 같은 라벨은:
- 13px, weight 500
- color `text-tertiary`
- letter-spacing: 0.02em
- 큰 숫자 위에 한 줄 배치

---

## 3. 공간 (Spacing)

8px 기본 그리드.

| 토큰 | px | 용도 |
|---|---|---|
| `space-1` | 4 | 텍스트 간격, 아이콘-텍스트 간격 |
| `space-2` | 8 | 작은 컴포넌트 패딩 (배지, 칩) |
| `space-3` | 12 | 카드 내부 작은 그룹 간격 |
| `space-4` | 16 | 일반 패딩 (입력 필드, 카드 내부) |
| `space-5` | 24 | 카드 패딩, 컴포넌트 그룹 간격 |
| `space-6` | 32 | 카드 사이 간격 |
| `space-8` | 48 | 섹션 사이 간격 (Hero ↔ OKR Tree) |
| `space-10` | 64 | 페이지 상하 마진 |

---

## 4. 레이아웃

### 4-1. 컨테이너

| 토큰 | px | 용도 |
|---|---|---|
| `container-max` | 1440 | 페이지 최대 너비 |
| `container-padding-x` | 32 | 좌우 패딩 |
| `breakpoint-min` | 1280 | 최소 지원 데스크탑 (모바일 미지원) |

### 4-2. 그리드

- **Hero Summary**: 4-col 가로 동일 폭
- **KR Card Grid**: 1280~1599px → 2-col, 1600px+ → 3-col
- **KPT 회고**: 멤버 수에 따라 2~4-col 자동 배치

### 4-3. 카드 비율

- **Hero 카드**: 정사각형에 가까운 비율 (1:1.1)
- **KR 카드**: 세로 카드, 최소 높이 280px

---

## 5. Radius & Elevation

### 5-1. Border Radius

| 토큰 | px | 용도 |
|---|---|---|
| `radius-sm` | 8 | 작은 배지, 칩, 작은 버튼 |
| `radius-md` | 12 | 일반 버튼, 입력 필드 |
| `radius-lg` | 16 | 카드 내부 작은 블록 |
| `radius-xl` | 20 | KR 카드, Hero 카드 |
| `radius-2xl` | 28 | 큰 컨테이너 (페이지 영역 묶음) |
| `radius-pill` | 999 | 알약형 버튼 (분기 셀렉터, 액션 버튼) |

> 레퍼런스 이미지처럼 카드와 버튼 모두 큰 radius로 통일감 부여.

### 5-2. Elevation (그림자)

다크 테마에서는 그림자보다 surface 명도 차로 elevation 표현. 추가 강조가 필요할 때만 글로우 사용.

| 토큰 | 값 | 용도 |
|---|---|---|
| `elevation-0` | none | 평면 카드 |
| `elevation-1` | `0 0 0 1px rgba(255,255,255,0.04)` | 카드 미세 외곽선 |
| `elevation-modal` | `0 24px 60px rgba(0,0,0,0.6)` | 모달 |
| `glow-success` | `0 0 24px rgba(34, 211, 126, 0.25)` | 달성 KR 카드 호버 |
| `glow-danger` | `0 0 24px rgba(255, 90, 74, 0.25)` | 위험 KR 카드 호버 |

---

## 6. 컴포넌트 비주얼 명세

### 6-1. Hero Card (가장 중요)

레퍼런스 이미지의 Portfolio Value 카드 패턴을 차용. **전체 평균 진척도 카드는 풀 배경 컬러로 차별화**, 나머지 3개는 일반 카드.

```
┌──────────────────────────────────────┐
│ ████████████████████████████████████ │  ← bg: accent-bg-warning (진척도가 노랑 구간일 때)
│ ████ Total Progress (라벨)        ██ │
│ ████                               ██ │
│ ████  42%        ↗ +12% vs 지난주 ██ │  ← display-hero, status-success 미니 배지
│ ████                               ██ │
│ ████████████████████████████████████ │
└──────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Achieved KR  │ │ Avg Confidence│ │ Quarter Pace │
│              │ │               │ │              │
│   3/5  🟢   │ │   中 🟡       │ │    57%       │  ← 일반 카드 (bg-surface-1)
│              │ │               │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

| 속성 | 값 |
|---|---|
| 배경 | "전체 평균 진척도"만 `accent-bg-{status}`, 나머지는 `bg-surface-1` |
| Radius | `radius-xl` (20px) |
| 패딩 | `space-5` (24px) |
| 큰 숫자 | `display-hero` (56px / 700) |
| 라벨 | `label-md`, `text-tertiary`, 대문자 |
| 보조 변화율 | 작은 알약 배지, `status-success` 또는 `status-danger` |
| 높이 | 최소 200px, 4개 카드 동일 |

### 6-2. KR Card

좌측 4px 색상 띠가 상태를 즉시 신호.

```
┌─────────────────────────────────────────┐
│█│                                       │  ← 좌측 띠: status-success / danger / idle
│█│  [Aspire]            👤 ben ria que ✕│
│█│  ─────────────────────────────────── │
│█│  응모·제안서 10건                     │  ← heading-md
│█│                                       │
│█│  현재 3건                             │  ← body-lg, text-primary
│█│  호반, IBK-다날, SBVA                 │  ← body-sm, text-tertiary
│█│                                       │
│█│  진척도   30%                         │
│█│  ▓▓▓░░░░░░░░░░░░░░░░░░░             │  ← 진척도 바
│█│                                       │
│█│  신뢰도   🟡 中                       │
│█│                                       │
│█│  갱신 2026-05-15                      │  ← caption
│█│  ─────────────────────────────────── │
│█│  🔴 위험                              │  ← 상태 배지 (있을 때만)
└─────────────────────────────────────────┘
```

| 속성 | 값 |
|---|---|
| 배경 | `bg-surface-1` |
| Radius | `radius-xl` (20px) |
| 패딩 | `space-5` (24px) — 좌측은 띠 때문에 +12px |
| 좌측 띠 | 4px width, 카드 전체 높이, status 색상 |
| 호버 | `elevation-1` + 해당 status의 `glow-*` |
| 편집 진입 | 카드 본문이 `bg-surface-2`로 가라앉으며 폼 노출 |

### 6-3. Progress Bar

```
▓▓▓▓▓▓▓░░░░░░░░░░░  65%
```

| 속성 | 값 |
|---|---|
| 높이 | 8px |
| Radius | `radius-pill` (full) |
| 트랙 배경 | `bg-surface-3` |
| 채움 색상 | status 색상 (success / warning / danger / idle) |
| 트랜지션 | width 600ms cubic-bezier(0.4, 0, 0.2, 1) |

### 6-4. Confidence Light (신뢰도 신호등)

3개 도트 + 활성 도트의 색상.

```
●●○   高    (success 3개 중 3 활성)
●●○   中    (warning 가운데까지)
●○○   低    (danger 1개만)
```

또는 단일 색 원:
```
🟢 高    🟡 中    🔴 低
```

| 변형 | 사용 |
|---|---|
| 도트 3개 패턴 | KR 카드 (정밀 표시) |
| 단일 원 + 라벨 | Hero "Avg Confidence" 카드 |

### 6-5. Status Badge (위험 / 달성)

```
[ 🔴 위험 ]            [ ✓ 달성 완료 ]
```

| 속성 | 값 |
|---|---|
| 패딩 | `space-1 space-2` (4 / 8px) |
| Radius | `radius-sm` (8px) |
| 배경 | status-{type}-soft |
| 텍스트 | status-{type}, `label-sm` (11px / 600) |
| 아이콘 | 12px, status-{type} |

### 6-6. Type Badge (Commit / Aspire)

```
[ Commit ]    [ Aspire ]
```

| 속성 | 값 |
|---|---|
| 배경 | type-{type}-soft |
| 테두리 | 1px solid type-{type} |
| 텍스트 | type-{type}, `label-sm` |

### 6-7. Owner Chip

```
[ 👤 benjamin ]   [ 👤 ria ]   [ 👤 que ]
```

| 속성 | 값 |
|---|---|
| 배경 | `bg-surface-3` |
| 텍스트 | `text-secondary`, `body-sm` |
| Radius | `radius-pill` |
| 패딩 | `space-1 space-3` |
| 아이콘 | 12px, 회색 (모두 동일 — IA 결정대로 색 없음) |

### 6-8. Button

| 변형 | 배경 | 텍스트 | Radius |
|---|---|---|---|
| **Primary** (예: 저장, 생성) | `text-primary` (#FFFFFF) | `bg-base` (#0A0A0B) | `radius-pill` |
| **Secondary** (예: 취소) | `bg-surface-2` | `text-primary` | `radius-pill` |
| **Ghost** (헤더 액션) | transparent | `text-secondary` | `radius-pill` |
| **Danger** (확인 다이얼로그 삭제) | `status-danger` | `text-primary` | `radius-pill` |

> 레퍼런스 이미지 헤더의 "Investment" 활성 탭처럼, Primary 버튼은 다크 배경에서 흰색 풀 채움이 가장 강한 시그널.

### 6-9. Quarter Selector

```
┌──────────────────────┐
│ 26.Q2  ▼             │
└──────────────────────┘
   ↓ 클릭 시
┌──────────────────────┐
│ ● 26.Q2  (active)    │  ← 굵게, text-primary
│   26.Q1  (archived)  │  ← text-tertiary
│   25.Q4              │
└──────────────────────┘
```

| 속성 | 값 |
|---|---|
| 트리거 | `radius-pill`, `bg-surface-2`, 패딩 `space-2 space-4` |
| 드롭다운 | `bg-surface-2`, `radius-lg`, 항목 호버 시 `bg-surface-3` |
| 활성 분기 표시 | 좌측 점(`status-success`) + 굵은 텍스트 |

### 6-10. Modal

| 속성 | 값 |
|---|---|
| 배경 | `bg-overlay` (페이지 딤) |
| 컨테이너 | `bg-surface-1`, `radius-2xl`, max-width 480px |
| 헤더 | `heading-md`, 우측 ✕ 버튼 |
| 본문 패딩 | `space-6` |
| 액션 | 하단 우측 정렬, Secondary + Primary |

### 6-11. Toast

| 속성 | 값 |
|---|---|
| 위치 | 우상단 fixed, top 24px, right 24px |
| 배경 | `bg-surface-2` |
| 좌측 띠 | 4px, status 색상 |
| 텍스트 | `body-md` |
| Radius | `radius-lg` |
| 노출 시간 | 성공 2초, 에러 4초 |
| 진입 | 우측에서 슬라이드 인 (200ms) |

### 6-12. Empty State

```
┌─────────────────────────────────┐
│                                  │
│        📋 (아이콘 80px)          │
│                                  │
│   분기가 아직 없습니다.            │
│                                  │
│   [ + 새 분기 만들기 ]            │
│                                  │
└─────────────────────────────────┘
```

| 속성 | 값 |
|---|---|
| 아이콘 | 80px, `text-muted` |
| 제목 | `heading-md`, `text-secondary` |
| CTA | Primary Button |

---

## 7. 아이콘 시스템

| 항목 | 결정 |
|---|---|
| 라이브러리 | **Lucide React** (또는 Heroicons) — 일관된 stroke width |
| Stroke width | 1.5px |
| 기본 크기 | 16px (body 안), 20px (버튼), 24px (헤더) |
| 색상 | 텍스트 색상과 동일 |
| 채움 vs 외곽선 | 외곽선 기본, 상태 강조 시(달성 ✓, 위험 ⚠) 채움 |

---

## 8. 모션

### 8-1. 트랜지션 토큰

| 토큰 | duration | easing | 용도 |
|---|---|---|---|
| `motion-instant` | 100ms | ease-out | 호버 색상 변경 |
| `motion-fast` | 200ms | cubic-bezier(0.4, 0, 0.2, 1) | 토스트 진입, 모달 열림 |
| `motion-base` | 300ms | cubic-bezier(0.4, 0, 0.2, 1) | 카드 호버 elevation |
| `motion-slow` | 600ms | cubic-bezier(0.4, 0, 0.2, 1) | 진척도 바 채움 애니메이션 |

### 8-2. 인터랙션

| 상황 | 동작 |
|---|---|
| 버튼 hover | 배경 1단계 밝아짐 (`motion-instant`) |
| 카드 hover | `elevation-1` + 해당 status `glow` (`motion-base`) |
| 진척도 저장 | 진척도 바가 새 값으로 600ms 애니메이션 |
| Hero 카드 숫자 갱신 | 짧은 fade + scale-up (200ms) |
| 모달 열림 | 페이지 딤 fade-in, 모달 200ms scale-up from 0.95 |

> 과도한 모션 금지. 핵심은 "데이터가 갱신됐다"는 신호만 짧게.

---

## 9. 데이터 시각화 디테일

### 9-1. Hero "전체 평균 진척도" 카드 (시그니처 요소)

레퍼런스 이미지의 오렌지 Portfolio Value 영역과 동일한 위상.

```
배경: accent-bg-{status} 풀 컬러 (warning이면 어두운 노랑)
큰 숫자: 56px, text-primary
서브 텍스트: "전체 평균 진척도", text-tertiary
미니 배지: "↗ +8% vs 지난주" — 변화율 [확장]
하단: 작은 진척도 바 또는 분기 경과율과 비교
```

### 9-2. KR 카드 좌측 띠 (시그니처 요소)

```
status-success  → 4px 초록 띠 + status-success-soft 카드 좌측 배경 그라데이션 (8px → 0)
status-danger   → 4px 빨강 띠 + status-danger-soft 카드 좌측 배경 그라데이션
status-idle     → 띠 없음 (또는 border-subtle)
```

### 9-3. 진척도 바 색상 흐름

진척도 값이 임계값을 넘으면 색이 즉시 바뀐다.

```
0%      30%        60%       100%
└─🔴────┴─🟡──────┴─🟢──────┘
```

---

## 10. 상태 표현 (State Variants)

| 상태 | 시각 처리 |
|---|---|
| 로딩 | 스켈레톤 UI (`bg-surface-2` ↔ `bg-surface-3` shimmer, 1.5s loop) |
| 빈 상태 | §6-12 Empty State 컴포넌트 |
| 에러 | 토스트 + 인라인 메시지 (`status-danger`) |
| 읽기 전용 (아카이브) | 모든 인터랙티브 요소 opacity 0.6, 호버 효과 제거 |
| 포커스 | 2px outline, `border-strong`, offset 2px |

---

## 11. PDF / 인쇄 모드

화면 다크 테마는 인쇄에 부적합. PDF 출력 시에만 **라이트 테마로 자동 전환**.

### 11-1. 인쇄용 컬러 매핑

| 다크 토큰 | 인쇄 라이트 대응 |
|---|---|
| `bg-base` (#0A0A0B) | `#FFFFFF` (흰 배경) |
| `bg-surface-1` (#141416) | `#F9FAFB` |
| `bg-surface-2` (#1C1C1F) | `#F3F4F6` |
| `text-primary` (#FFFFFF) | `#0A0A0B` |
| `text-tertiary` (#9CA3AF) | `#6B7280` |
| status 솔리드 색상 | 채도를 약간 낮춰 인쇄 친화 (#22D37E → #15A862) |
| Hero "전체 평균 진척도" 풀 배경 | 옅은 톤으로 변환 (예: 진한 노랑 → 연한 노랑) |

### 11-2. CSS 구현

```css
@media print {
  :root {
    --bg-base: #FFFFFF;
    --bg-surface-1: #F9FAFB;
    --text-primary: #0A0A0B;
    /* ... */
  }
  /* status 색상도 인쇄용 변수로 오버라이드 */
}
```

### 11-3. 인쇄에서 유지할 것
- 큰 숫자 크기 (Hero 카드)
- 좌측 색상 띠 (status 식별)
- 진척도 바 색상
- 카드 레이아웃과 그룹핑

### 11-4. 인쇄에서 제거할 것
- 호버 효과·글로우
- 헤더 액션 버튼·삭제 ✕·+ 추가 버튼
- 트랜지션·애니메이션

---

## 12. 접근성

| 항목 | 기준 |
|---|---|
| 텍스트 대비 | `text-primary` on `bg-base` = 19:1 (WCAG AAA) |
| 보조 텍스트 대비 | `text-tertiary` on `bg-base` ≥ 7:1 (WCAG AAA) |
| 상태 색상 단독 의존 금지 | 색 + 아이콘 + 텍스트 라벨 병기 (예: 🔴 + "위험") |
| 포커스 가시성 | 모든 인터랙티브 요소에 2px outline |
| 모션 감도 | `prefers-reduced-motion`이면 트랜지션 50ms로 단축 |
| 키보드 네비게이션 | Tab으로 모든 액션 도달 가능, ESC로 모달 닫기 |

> 색상만으로 상태를 구분하지 않는다. 위험 KR은 🔴 색 + ⚠ 아이콘 + "위험" 텍스트 3중 신호.

---

## 13. 디자인 토큰 (Tailwind 기준)

`tailwind.config.ts`에 매핑할 토큰 요약.

```typescript
export default {
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0A0A0B',
          surface1: '#141416',
          surface2: '#1C1C1F',
          surface3: '#252529',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E5E5E7',
          tertiary: '#9CA3AF',
          muted: '#6B7280',
        },
        status: {
          success: '#22D37E',
          'success-soft': '#1F3D2D',
          warning: '#F5C043',
          'warning-soft': '#3D3320',
          danger: '#FF5A4A',
          'danger-soft': '#3D211F',
          idle: '#6B7280',
          'idle-soft': '#252529',
        },
        accent: {
          'bg-success': '#1A4030',
          'bg-warning': '#403320',
          'bg-danger': '#4A2520',
        },
        type: {
          commit: '#5B8DEF',
          'commit-soft': '#1E2A40',
          aspire: '#B57BFF',
          'aspire-soft': '#2A1E40',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-hero': ['56px', { lineHeight: '64px', fontWeight: '700' }],
        'heading-xl':   ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'heading-lg':   ['22px', { lineHeight: '30px', fontWeight: '600' }],
        'heading-md':   ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body-lg':      ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'body-md':      ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm':      ['13px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md':     ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'label-sm':     ['11px', { lineHeight: '16px', fontWeight: '600' }],
        'caption':      ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
    },
  },
};
```

---

## 14. 톤앤매너 체크리스트

신규 컴포넌트 디자인 시 검증.

- [ ] 다크 배경(`bg-base`) 위에서 정보 위계가 한눈에 보이는가?
- [ ] 가장 중요한 수치가 가장 큰 활자(`display-hero` 또는 `heading-xl`)인가?
- [ ] 상태가 색·아이콘·텍스트 3중 신호로 표현되는가?
- [ ] Border radius가 시스템 토큰(8/12/16/20/28 또는 pill) 안에 있는가?
- [ ] 카드 간 여백이 `space-6`(32px) 이상인가?
- [ ] 호버·포커스 상태가 정의되어 있는가?
- [ ] 인쇄 모드에서 라이트 테마로 정상 변환되는가?
- [ ] WCAG AA 이상 대비를 만족하는가?

---

## 15. 가정 사항

| # | 항목 | 가정 |
|---|---|---|
| DS1 | 폰트 | Pretendard 사용. 라이선스·번들 비용은 self-hosted로 해결 |
| DS2 | 아이콘 라이브러리 | Lucide React |
| DS3 | 다크 테마 고정 | 라이트 테마 토글 미제공. PDF 출력 시에만 자동 라이트 변환 |
| DS4 | 색맹 사용자 대응 | 색+아이콘+텍스트 3중 표시로 1차 해결. 색맹 시뮬레이션 검증은 후속 |
| DS5 | 브랜드 로고 | 별도 디자인 없음. "사업전략팀 OKR" 텍스트 로고로 시작 |
| DS6 | Hero "변화율" 미니 배지 | "지난주 대비 +N%"는 주차별 스냅샷이 없어 v1에서 미구현. v2에서 검토 |
