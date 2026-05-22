# 사업전략팀 OKR 대시보드

분기 OKR 진척도와 회고를 한 페이지에서 시각적으로 관리하는 Next.js 대시보드.

- **스택**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Vercel KV
- **배포**: Vercel
- **권한**: 인증 없음 (링크 보유자 전원 보기·편집)

자세한 기획·구조·디자인 문서는 다음을 참고:
- [PRD.md](PRD.md) — 제품 요구사항
- [IA.md](IA.md) — 정보 구조
- [Workflow.md](Workflow.md) — 사용자·화면·상태 전이
- [TRD.md](TRD.md) — 기술 요구사항
- [DesignSystem.md](DesignSystem.md) — 디자인 시스템

---

## 빠른 시작

### 1) 의존성 설치

```bash
pnpm install
# 또는 npm install / yarn install
```

### 2) 환경 변수 설정

Vercel KV는 Vercel Storage 통합 시 자동 주입됩니다. 로컬 개발 시에는 Vercel에서 KV 값을 복사해 `.env.local`에 추가하세요.

```bash
cp .env.example .env.local
# .env.local 에 다음 값을 채워 넣기:
# KV_URL=...
# KV_REST_API_URL=...
# KV_REST_API_TOKEN=...
# KV_REST_API_READ_ONLY_TOKEN=...
```

> Vercel KV 값은 Vercel 대시보드 → Storage → 해당 KV 인스턴스 → `.env.local` 탭에서 한 번에 복사할 수 있습니다.

### 3) 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 http://localhost:3000 접속.

---

## Vercel 배포

### 1) Vercel 프로젝트 생성

- GitHub에 이 저장소를 푸시
- [vercel.com](https://vercel.com) → New Project → 저장소 선택 → 기본 설정으로 Deploy

### 2) Vercel KV 연결

- Vercel 프로젝트 진입 → **Storage** 탭 → **Create Database** → **KV** 선택
- 생성된 KV 인스턴스를 프로젝트에 연결 (`Connect Project`)
- 환경변수 4종(`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`)이 자동 주입됨

### 3) 재배포

- KV 연결 후 자동 재배포 트리거됨
- 배포 완료 시 `*.vercel.app` URL이 발급됨

### 4) 도메인 (선택)

- 프로젝트 → **Domains** 탭에서 커스텀 도메인 연결

> 인증이 없는 대시보드이므로 URL을 공유받은 사람은 누구나 보기·편집할 수 있습니다. 사외에 공유하지 않도록 운영상 주의하세요.

---

## 사용 가이드

### 첫 실행 (분기 0개)

상단 헤더의 **[+ 새 분기]** 버튼을 눌러 첫 분기를 만드세요.
- 분기명 예: `26.Q3`
- 시작일·종료일 입력

### 매주 갱신 (편집자)

1. 본인 담당 KR 카드 클릭
2. 현재값 / 진척도(%) / 신뢰도(高/中/低) 입력
3. **저장** → Hero 카드와 차트가 즉시 갱신됨

### 새 분기 시작

- **[+ 새 분기]** → 새 분기 생성 시 기존 활성 분기는 자동으로 아카이브됨
- 과거 분기는 상단 분기 셀렉터에서 읽기 전용으로 조회 가능

### PDF 보고서

- 우상단 **[PDF 다운로드]** 버튼 → 브라우저 인쇄 다이얼로그
- 인쇄 또는 "PDF로 저장" 선택
- 자동으로 라이트 테마로 변환되며 편집 UI는 모두 숨겨짐

### 멤버 관리

- 우상단 **[멤버 관리]** → 멤버 추가/삭제
- 추가된 멤버는 KR Owner 선택지와 KPT 회고 카드에 즉시 반영됨

---

## 디렉토리 구조

```
/
├─ app/
│  ├─ layout.tsx         # 전역 레이아웃 + Toast Provider
│  ├─ page.tsx           # 메인 대시보드 (Server Component)
│  ├─ actions.ts         # Server Actions (12종)
│  └─ globals.css        # Tailwind + 인쇄용 CSS
├─ components/
│  ├─ header/            # Global Header / Quarter Selector / Action Buttons
│  ├─ meta/              # Quarter Meta Bar
│  ├─ hero/              # Hero Summary + Hero Card
│  ├─ tree/              # OKR Tree / Objective Section / KR Card
│  ├─ score/             # Score Table
│  ├─ retro/             # KPT Section
│  ├─ modal/             # Modal Container / New Quarter / Member Manage / Confirm
│  └─ ui/                # Button / ProgressBar / Badge / Chip / Toast 등
├─ lib/
│  ├─ types.ts           # 데이터 타입
│  ├─ kv.ts              # Vercel KV 클라이언트 + 키 빌더
│  ├─ calc.ts            # 진척도·경과율 등 계산 함수
│  ├─ constants.ts       # 임계값
│  └─ id.ts              # ID 생성 헬퍼
├─ PRD.md / IA.md / Workflow.md / TRD.md / DesignSystem.md
├─ package.json
├─ tailwind.config.ts
├─ tsconfig.json
└─ next.config.js
```

---

## 데이터 모델 요약

| 키 패턴 | 값 |
|---|---|
| `quarters:list` | 분기 ID 배열 |
| `quarter:{qid}` | Quarter 메타 |
| `quarter:{qid}:objectives` | Objective ID 배열 |
| `quarter:{qid}:objective:{oid}` | Objective 본문 |
| `quarter:{qid}:objective:{oid}:krs` | KR ID 배열 |
| `quarter:{qid}:kr:{kid}` | KR 본문 (진척도, 신뢰도, 갱신일 등) |
| `quarter:{qid}:final_score:{kid}` | 분기 종료 후 결과·평가 |
| `quarter:{qid}:retro:{member_id}` | KPT 회고 |
| `members:list` | 멤버 명단 |

자세한 명세는 [TRD.md](TRD.md) §4 참조.

---

## 트러블슈팅

| 증상 | 해결 |
|---|---|
| "KV 연결 실패" / 페이지 진입 시 에러 | Vercel Storage에서 KV 인스턴스를 프로젝트에 연결했는지 확인. 환경변수 4종이 모두 주입되어야 합니다 |
| 저장은 됐는데 화면이 안 바뀜 | 페이지 새로고침. `revalidatePath`가 동작하지만 일부 캐시 상황에서 지연 가능 |
| PDF 출력 시 색상이 단조로움 | 브라우저 인쇄 설정에서 **"배경 그래픽"** 옵션을 켜야 색상이 함께 출력됩니다 |
| 분기 셀렉터에 분기가 없음 | "+ 새 분기"로 첫 분기를 만들어야 셀렉터에 항목이 나타납니다 |

---

## 라이선스

내부 사용 (사업전략팀).
