# 사업전략팀 OKR 대시보드

분기 OKR 진척도와 회고를 한 페이지에서 시각적으로 관리하는 Next.js 대시보드.

- **스택**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **데이터 저장**: **Upstash Redis** (서버리스, 무료 한도 내)
- **배포**: Vercel 무료 플랜으로 동작
- **권한**: 인증 없음 — 링크 보유자 누구나 보기·편집 + **모두가 같은 데이터 공유**

자세한 기획·구조·디자인 문서:
- [PRD.md](PRD.md) · [IA.md](IA.md) · [Workflow.md](Workflow.md) · [TRD.md](TRD.md) · [DesignSystem.md](DesignSystem.md)

---

## 데이터 공유 방식

이 대시보드는 **Upstash Redis 한 인스턴스에 모든 데이터를 저장**합니다. URL을 공유받은 사람은 누구나 **같은 데이터를 보고 편집**할 수 있습니다.

| 항목 | 동작 |
|---|---|
| ✅ 다른 PC / 다른 브라우저 | 같은 데이터를 봄 (서버 단일 저장소) |
| ✅ 한 명이 갱신 → 다른 사람이 새로고침 | 변경사항 즉시 반영 |
| ⚠️ 인증 없음 | 링크 보유자 누구나 편집 가능 (사외 공유 주의) |

> 실시간 자동 sync(웹소켓)는 아니지만, 새로고침하면 항상 최신 상태가 표시됩니다.

---

## 빠른 시작 (로컬)

```bash
pnpm install     # 또는 npm install / yarn

# .env.local 생성 후 Upstash 키 추가
cp .env.example .env.local
# UPSTASH_REDIS_REST_URL=...
# UPSTASH_REDIS_REST_TOKEN=...

pnpm dev         # → http://localhost:3000
```

Upstash 키 발급:
1. https://console.upstash.com → GitHub 로그인
2. Redis → Create Database (Regional, Singapore/Tokyo, Free)
3. REST API 섹션에서 URL과 TOKEN 복사

---

## Vercel 배포

### 1) GitHub push
```bash
git push origin main
```

### 2) Vercel 환경변수 추가
프로젝트 → Settings → Environment Variables
- `UPSTASH_REDIS_REST_URL` = Upstash URL
- `UPSTASH_REDIS_REST_TOKEN` = Upstash 토큰
- Environment: All (Production / Preview / Development)

### 3) 재배포
환경변수 추가 후 자동 재배포됨. 또는 Deployments → ⋯ → Redeploy.

---

## 사용 가이드

### 첫 진입
- "분기가 아직 없습니다" 화면이 보이면 **[26.Q2 샘플 데이터 불러오기]** 클릭
- 또는 우상단 **[+ 새 분기]** 로 빈 분기 시작

### 매주 갱신
1. 본인 담당 KR 카드 클릭
2. **목표값(숫자)** + **현재값(숫자)** 입력 → 진척도 자동 계산 (예: 2/3 → 67%)
3. 신뢰도(상/중/하) 선택
4. **저장** → 원형 게이지·점수표 즉시 갱신

### 분기 점수표 (자동)
- **Aspire**: 진척도 ≥ 60% → 🟢 성공
- **Commit**: 진척도 ≥ 100% → 🟢 성공
- 미만: 🟡 진행 중 / ⚪ 미시작

### 기준 날짜 변경
- 메타바 우측 📅 → 날짜 변경 시 경과율·주차·갱신 카운터 모두 즉시 재계산

### 새 분기
- **[+ 새 분기]** → 분기명·시작일·종료일 입력
- 이전 활성 분기는 자동 아카이브, 상단 셀렉터에서 읽기 전용 조회

### 멤버 관리
- **[멤버 관리]** → 추가/삭제. Owner 드롭다운과 KPT 카드에 즉시 반영

### PDF 보고서
- 우상단 **[PDF 다운로드]** → 브라우저 인쇄 다이얼로그
- 다크 → 라이트 테마 자동 변환되어 출력

### 데이터 백업·이관
- **Export**: 현재 DB 상태를 JSON으로 다운로드
- **Import**: JSON 업로드 → DB 덮어쓰기 (확인 없이 즉시 적용, 주의)
- **전체 초기화**: 페이지 하단 우측 작은 버튼 (Upstash DB에서도 삭제)

---

## 디렉토리 구조

```
/
├─ app/
│  ├─ layout.tsx            # 전역 레이아웃 + Toast Provider
│  ├─ page.tsx              # Server Component (Upstash fetch)
│  ├─ actions.ts            # Server Actions (Upstash CRUD)
│  └─ globals.css           # Tailwind + 인쇄용 CSS
├─ components/
│  ├─ DashboardClient.tsx   # 페이지의 메인 로직 (Client)
│  ├─ header/               # GlobalHeader / QuarterSelector / ActionButtons / DataIO
│  ├─ meta/                 # QuarterMetaBar (기준 날짜 picker)
│  ├─ hero/                 # HeroSummary / HeroCard
│  ├─ tree/                 # OKRTree / ObjectiveSection / KRCard (원형 게이지)
│  ├─ score/                # ScoreTable (자동 평가)
│  ├─ retro/                # KPTSection
│  ├─ modal/                # Modal / ConfirmDialog / NewQuarter / MemberManage
│  └─ ui/                   # Button / ProgressCircle / Badge / Logo / Toast 등
├─ lib/
│  ├─ types.ts              # 데이터 타입
│  ├─ storage.ts            # Upstash Redis 클라이언트
│  ├─ seed.ts               # 26.Q2 샘플 데이터
│  ├─ calc.ts               # 진척도·경과율·달성 판정
│  ├─ constants.ts          # 임계값 (Aspire 0.6, Commit 1.0)
│  └─ id.ts                 # ID 생성 헬퍼
├─ PRD.md / IA.md / Workflow.md / TRD.md / DesignSystem.md
└─ ...설정 파일
```

---

## 데이터 모델

Upstash Redis의 **단일 키 `okr-dashboard:v1`**에 전체 상태(JSON)를 저장합니다.

```ts
{
  quarters: { [qid]: Quarter },
  quartersOrder: string[],
  objectives: { [oid]: { quarter_id, data: Objective } },
  objectivesOrder: { [qid]: string[] },
  krs: { [kid]: { quarter_id, data: KR } },
  krsOrder: { [`${qid}:${oid}`]: string[] },
  finalScores: { [`${qid}:${kid}`]: FinalScore },  // (현재 미사용)
  retros: { [`${qid}:${mid}`]: Retro },
  members: Member[]
}
```

단일 키 단순 저장 방식이라 매 변경마다 read + write 1회. 데이터 크기가 작아(보통 < 50KB) 효율적이며 동시성 문제도 최소화.

---

## 트러블슈팅

| 증상 | 해결 |
|---|---|
| 페이지 진입 시 500 에러 | Vercel 환경변수 2종(UPSTASH_REDIS_REST_URL/TOKEN) 누락 또는 오타. Settings에서 확인 |
| Import 후 이전 데이터로 되돌리기 | 미리 받아둔 Export JSON을 다시 Import (덮어쓰기) |
| PDF 색상이 단조로움 | 브라우저 인쇄 설정에서 **"배경 그래픽"** 옵션 켜기 |
| Upstash 무료 한도 초과 (10K/day) | 사용량은 Upstash 콘솔에서 확인. 팀 규모상 거의 도달 어려움 |

---

## 라이선스

내부 사용 (사업전략팀).
