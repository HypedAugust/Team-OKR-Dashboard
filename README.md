# 사업전략팀 OKR 대시보드

분기 OKR 진척도와 회고를 한 페이지에서 시각적으로 관리하는 Next.js 대시보드.

- **스택**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **데이터 저장**: **브라우저 localStorage** (외부 DB 불필요)
- **배포**: Vercel 무료 플랜으로 100% 동작
- **권한**: 인증 없음 — 링크 보유자 누구나 보기·편집

자세한 기획·구조·디자인 문서:
- [PRD.md](PRD.md) · [IA.md](IA.md) · [Workflow.md](Workflow.md) · [TRD.md](TRD.md) · [DesignSystem.md](DesignSystem.md)

---

## ⚠️ 데이터 저장 방식이 localStorage라는 의미

이 대시보드는 **외부 데이터베이스를 쓰지 않습니다.** 모든 데이터(분기, OKR, 회고)는 **사용자의 브라우저 안에만 저장**됩니다.

| 항목 | 동작 |
|---|---|
| ✅ 같은 브라우저 같은 PC | 새로고침해도 그대로 |
| ✅ 같은 브라우저 다른 탭 | 자동 동기화됨 |
| ❌ 다른 PC / 다른 브라우저 | **각자 자기 데이터를 봄** (자동 동기화 안 됨) |
| ❌ 시크릿 모드 / 캐시 삭제 | 데이터 사라짐 |

**팀 공유 운영 방법**: 헤더의 **[Export]** 버튼으로 JSON 파일을 받아 팀원에게 전달하고, 받은 사람은 **[Import]** 로 불러오면 됩니다. 매주 한 명이 마스터 사본을 관리하고 다른 사람은 Import해서 보는 방식을 권장합니다.

> 실시간 다중 사용자 동기화가 꼭 필요하면 별도 DB(Vercel KV, Supabase, Firebase 등) 연결이 필요합니다. 그땐 `lib/storage.ts`만 그 DB로 바꿔 끼우면 됩니다.

---

## 빠른 시작 (로컬)

```bash
pnpm install     # 또는 npm install / yarn
pnpm dev         # → http://localhost:3000
```

별도 환경변수 설정 없음. 즉시 동작합니다.

---

## Vercel 배포 (무료 Hobby 플랜)

### 1) GitHub repo에 push
이미 git이 초기화돼 있다면:
```bash
git push origin main
```

### 2) Vercel에서 Import
1. https://vercel.com/new
2. **Import Git Repository** → 해당 repo 선택
3. Framework: **Next.js** 자동 감지
4. 환경변수 입력 없이 **Deploy** 클릭
5. 끝. `*.vercel.app` URL이 발급되고 즉시 사용 가능

> KV 데이터베이스, 환경변수, 결제 정보 모두 필요 없습니다.

---

## 사용 가이드

### 첫 진입
- "분기가 아직 없습니다" 화면이 보입니다
- **[26.Q2 샘플 데이터 불러오기]** 클릭하면 PDF 기반 샘플 OKR과 멤버가 채워짐 (운영 시작 전 둘러보기용)
- 또는 우상단 **[+ 새 분기]** 로 빈 분기 시작

### 매주 갱신
1. 본인 담당 KR 카드 클릭
2. 현재값 / 진척도(%) / 신뢰도(高/中/低) 입력
3. **저장** → Hero 카드와 진척도 바가 즉시 갱신

### 새 분기 시작
- **[+ 새 분기]** → 분기명·시작일·종료일 입력
- 이전 활성 분기는 자동으로 아카이브 → 상단 셀렉터에서 읽기 전용 조회 가능

### 멤버 관리
- **[멤버 관리]** → 추가/삭제
- Owner 선택 드롭다운과 KPT 회고 카드에 즉시 반영

### PDF 보고서
- **[PDF 다운로드]** → 브라우저 인쇄 다이얼로그
- "PDF로 저장" 선택 시 다크 → 라이트 테마로 자동 변환되어 출력

### 데이터 백업·공유 (중요)
- **Export**: 현재 모든 데이터를 JSON 파일로 다운로드 → 백업 또는 팀원에게 전달
- **Import**: JSON 파일 업로드 → 현재 브라우저 데이터를 그것으로 덮어쓰기 (확인 다이얼로그 없음, 주의)

---

## 디렉토리 구조

```
/
├─ app/
│  ├─ layout.tsx         # 전역 레이아웃 + Toast Provider
│  ├─ page.tsx           # 서버 쉘 (Suspense)
│  ├─ actions.ts         # CRUD 액션 (localStorage 기반, 클라이언트)
│  └─ globals.css        # Tailwind + 인쇄용 CSS
├─ components/
│  ├─ DashboardClient.tsx  # 페이지의 실제 로직 (Client)
│  ├─ header/              # GlobalHeader / QuarterSelector / ActionButtons / DataIO
│  ├─ meta/                # QuarterMetaBar
│  ├─ hero/                # HeroSummary / HeroCard
│  ├─ tree/                # OKRTree / ObjectiveSection / KRCard
│  ├─ score/               # ScoreTable
│  ├─ retro/               # KPTSection
│  ├─ modal/               # Modal / ConfirmDialog / NewQuarter / MemberManage
│  └─ ui/                  # Button / ProgressBar / Badge / Chip / Toast 등
├─ lib/
│  ├─ types.ts           # 데이터 타입
│  ├─ storage.ts         # localStorage CRUD + change event
│  ├─ seed.ts            # 26.Q2 샘플 데이터
│  ├─ calc.ts            # 진척도·경과율·달성 판정
│  ├─ constants.ts       # 임계값
│  └─ id.ts              # ID 생성 헬퍼
├─ PRD.md / IA.md / Workflow.md / TRD.md / DesignSystem.md
└─ ...설정 파일
```

---

## 데이터 모델 요약

브라우저 localStorage 키 **`okr-dashboard-v1`** 에 JSON 한 덩어리로 저장됩니다.

```ts
{
  quarters: { [qid]: Quarter },
  quartersOrder: string[],
  objectives: { [oid]: { quarter_id, data: Objective } },
  objectivesOrder: { [qid]: string[] },
  krs: { [kid]: { quarter_id, data: KR } },
  krsOrder: { [`${qid}:${oid}`]: string[] },
  finalScores: { [`${qid}:${kid}`]: FinalScore },
  retros: { [`${qid}:${mid}`]: Retro },
  members: Member[]
}
```

자세한 명세는 [TRD.md](TRD.md) §4, [PRD.md](PRD.md) §9 참조.

---

## 트러블슈팅

| 증상 | 해결 |
|---|---|
| 데이터가 사라졌어요 | 브라우저 캐시·시크릿 모드 사용 여부 확인. 일반 모드에서 Export로 주기적 백업 권장 |
| 다른 사람 화면에 내 데이터가 안 보임 | localStorage는 브라우저 단위. **Export → 전달 → Import** 흐름으로 동기화 |
| PDF 색상이 단조로움 | 브라우저 인쇄 설정에서 **"배경 그래픽"** 옵션 켜기 |
| Import 후 이전 데이터로 되돌리고 싶음 | 미리 받아둔 Export JSON을 다시 Import (덮어쓰기) |

---

## 향후 확장 (옵션)

`lib/storage.ts`의 함수만 다른 백엔드로 교체하면 됩니다:

| 옵션 | 무료 한도 | 설정 난이도 |
|---|---|---|
| Vercel KV | 30K commands/day | Vercel Storage 탭에서 클릭 5회 |
| Upstash Redis | 10K commands/day | Upstash 회원가입 + DB 생성 |
| Supabase | 500MB | 프로젝트 생성 + 테이블 정의 |

---

## 라이선스

내부 사용 (사업전략팀).
