# SPEC.md — 기능 명세

본 문서는 각 섹션/기능의 **무엇을 해야 하는가**와 **완료 기준**(acceptance criteria, AC)을 정의한다. frontend agent + reviewer agent의 주요 참조 문서.

규칙:
- 모든 항목은 AC를 만족해야 머지 가능
- AC와 충돌하는 결정은 즉시 head 보고
- DESIGN.md 가드레일이 항상 우선

---

## 전역 (Cross-cutting)

### G1. 성능
- **AC1**: Lighthouse Performance 95+ (production 빌드 기준, 데스크탑/모바일)
- **AC2**: LCP < 1.5s, INP < 200ms, CLS < 0.05
- **AC3**: 초기 JS 번들 < 100KB gzip
- **AC4**: 모든 이미지는 `next/image` 사용 (또는 `<picture>` 명시적 사용)

### G2. 접근성 (WCAG 2.2 AA)
- **AC1**: Lighthouse Accessibility 95+
- **AC2**: 키보드만으로 모든 인터랙션 가능
- **AC3**: 모든 이미지 `alt`, 모든 인터랙티브 요소 `aria-label` 또는 visible text
- **AC4**: focus 가시성 (DESIGN.md 토큰의 accent-blue로 outline)
- **AC5**: 색 대비 4.5:1 이상 (DESIGN.md 토큰은 이미 OK)
- **AC6**: 인터랙티브 요소 최소 24×24 CSS 픽셀 (WCAG 2.2 SC 2.5.8)
- **AC7**: 폼은 label, error message, required indicator 명확

### G3. SEO
- **AC1**: Lighthouse SEO 95+
- **AC2**: 모든 페이지 meta title (60자 이하), description (160자 이하)
- **AC3**: OG image (1200×630) + Twitter Card
- **AC4**: sitemap.xml 존재 + 정상
- **AC5**: robots.txt 존재
- **AC6**: 구조화 데이터 (Person schema.org)

### G4. 반응형
- **AC1**: 320px 너비부터 정상 작동 (iPhone SE 등 작은 화면)
- **AC2**: 4 breakpoint: sm(640) / md(768) / lg(1024) / xl(1280)
- **AC3**: 데스크탑/태블릿/모바일 각각 본인이 봐서 자연스러움

### G5. 시그니처 보존
- **AC1**: try/catch/finally 코드 블록이 Hero에 prominent 위치
- **AC2**: Footer에 모토 재등장
- **AC3**: 시그니처 코드 블록은 JetBrains Mono + 라이트 syntax highlighting

### G6. 분석 / 동의
- **AC1**: GA4 스크립트는 사용자 동의 후에만 로드
- **AC2**: 동의 banner: 첫 방문 시 표시, 거부/수락 후 localStorage에 저장
- **AC3**: localhost 환경에서는 GA4 자동 비활성

---

## 섹션 1 — Hero

### 목적
방문자가 5초 안에 "이 사람이 누구이고 무엇을 하는 사람인지" 파악.

### 구성 요소
- 이름 (`이준익 / Lee Junik`) — Display 폰트 (Schibsted Grotesk) + Pretendard 한글
- 역할 라벨 (`DevOps / Platform Engineer`)
- **try/catch/finally 코드 블록** (시그니처)
- 모토 한 줄 ("Try the code, Catch the people, Finally make it reliable.")
- 스크롤 유도 `↓` 아이콘 (Phosphor `ArrowDown`)

### AC
- **AC1**: 이름/역할/시그니처/모토 4요소가 한 화면 안에 모두 보임 (1080p 데스크탑 기준)
- **AC2**: 코드 블록은 단순 텍스트가 아닌 실제 syntax highlighting (try/catch/finally는 accent-blue, 함수명은 text-primary, 문자열 있다면 accent-pink)
- **AC3**: 모바일에서 코드 블록은 가로 스크롤 없이 정상 표시 (필요 시 줄바꿈)
- **AC4**: 스크롤 유도 `↓`는 미세하게 위아래 움직이는 호버 효과 (자동 반복은 금지, 호버 시에만 1회)
- **AC5**: 첫 페인트에 LCP 요소가 이름/시그니처가 되도록 (이미지 X, 빠른 텍스트 우선)

### 인터랙션
- 코드 블록 호버 시 미세 그림자 + 보더 색 전환
- 모토 호버 시 강조 텍스트(`try`, `catch`, `finally`)가 색 변화

---

## 섹션 2 — About

### 목적
본인의 작업 철학과 정체성을 명확히 전달.

### 구성 요소
- About 본문 (CONTENT.md `About Me` 텍스트 그대로)
- **정체성 요약 표**: Role / Interest / Current / Certification / Motto (CONTENT.md)
- (선택) 키워드 아이콘 그리드 — 기각. CONTENT.md에 풍부한 텍스트가 있어 텍스트 우선

### AC
- **AC1**: 본문은 CONTENT.md와 정확히 일치 (수정 시 CONTENT.md 먼저 업데이트)
- **AC2**: 정체성 요약 표는 데스크탑에서 2-column, 모바일에서 1-column
- **AC3**: 표 행 hover 시 미세한 배경 색 변화 (accent-blue 5% 정도 tint)

---

## 섹션 3 — Tech Stack

### 목적
본인의 기술 스택을 시각적으로 빠르게 전달. 텍스트 위주 X.

### 구성 요소
6개 카테고리 그룹 (CONTENT.md 순서):
1. DevOps / Platform
2. Cloud / Infrastructure
3. Languages
4. Frontend / Mobile
5. Backend
6. Tools & Collaboration

각 그룹 내부: 큰 아이콘 그리드.

### AC
- **AC1**: 카테고리 순서는 DevOps / Platform이 가장 위 (정체성 우선)
- **AC2**: 각 기술은 공식 브랜드 SVG (있는 것) 또는 Phosphor 아이콘
- **AC3**: 진행도 바, %, 별점 절대 없음
- **AC4**: 호버 시 Lordicon 1회 재생 또는 미세 scale + 색 전환
- **AC5**: 그리드: 4~6 col desktop / 2~3 col mobile, gap-6 또는 gap-8
- **AC6**: 텍스트 라벨은 아이콘 아래 작게 (text-sm)

### 아이콘 우선순위
1. **DevOps**: linux(Tux), docker(공식), kubernetes(공식), nginx, jenkins, github-actions(brand mark), helm, argo-cd, opa
2. **Cloud**: aws, terraform
3. **Languages**: python, typescript, javascript, java
4. **Frontend/Mobile**: react, vue, android (Phosphor `AndroidLogo` 또는 brand)
5. **Backend**: django, spring
6. **Tools**: git, github, gitlab, figma, jira, mattermost, slack

브랜드 SVG는 [simple-icons](https://simpleicons.org/) 우선. Phosphor는 fallback.

---

## 섹션 4 — Experience

### 목적
현재 활동(SSAFY 실습코치)을 명확히 전달. 향후 경력 추가될 자리.

### 구성 요소
- 단일 entry (현재): SSAFY 13기·14기 실습코치 (2025.06 ~ 현재)
- 좌측: 기간 + 역할
- 우측: 본문 + 주요 업무 표

### AC
- **AC1**: CONTENT.md의 내용 그대로
- **AC2**: 향후 경력 추가 시 비주얼 타임라인으로 자동 확장 가능한 구조 (배열 기반 렌더)
- **AC3**: 주요 업무 표는 모바일에서 카드 스택으로 변환

---

## 섹션 5 — Featured Projects

### 목적
실제 작업물 + 수상 경력 시각적 노출.

### 구성 요소
- 4개 그룹 헤더: **In Progress / In Operation / Developer Tools / Mobile**
- 각 그룹: 1~2개 프로젝트 카드
- 카드: 썸네일 이미지 (있으면) + 제목 + 역할/수상 라벨 + 한 줄 설명 + 스택 태그
- 클릭 시 상세 보기 (모달 또는 별도 페이지)

### 6개 프로젝트 (CONTENT.md 기준)
1. **DevFlow Harness** [In Progress] — Jira-based DevOps Workbench
2. **Couple Diary** [In Operation] — Personal Project
3. **PADING** [Developer Tools] — 페어프로그래밍 WEB IDE, 공통 2등
4. **Mattermost 예약 메시지 플러그인** [Developer Tools]
5. **WhistleHub** [Mobile] — 음악 생성 모바일 앱, 특화 1등
6. **Amoverse** [Mobile] — 아티스트 모바일 전시회 앱, 자율 2등

### AC
- **AC1**: 4개 그룹 헤더가 시각적으로 구분 (작은 라벨 또는 색 도트)
- **AC2**: 수상 프로젝트는 trophy 아이콘 + 등수 표시 (1등/2등)
- **AC3**: 데스크탑 2-col grid / 모바일 1-col
- **AC4**: 호버 시 카드 scale(1.02) + 보더 컬러 전환 + 미세 그림자 (0.2s ease-out)
- **AC5**: 클릭 시 상세 (1차: 같은 페이지 모달, 2차 확장: `/projects/[slug]` 라우트)
- **AC6**: 각 카드는 키보드 접근 가능 (`<a>` 또는 `<button>`, focus 가시)
- **AC7**: 썸네일 없는 프로젝트는 텍스트만 깔끔하게 (placeholder 패턴 X)

### 상세 (모달 또는 페이지)
- problem → solution → tech 내러티브 구조 (CONTENT.md 따름)
- 상세 페이지 라우트는 1차에 미구현, 모달로 시작
- 모달은 `dialog` element (a11y), Escape 키로 닫힘

---

## 섹션 6 — Awards

### 목적
SSAFY 수상 경력 강조.

### 구성 요소
- 3개 수상 entry (CONTENT.md)
- 테이블 또는 미니 카드 행

### AC
- **AC1**: 시각적으로 무겁지 않게 (Hero/Projects보다 작은 비중)
- **AC2**: trophy 아이콘 일관 사용
- **AC3**: 등수가 명확히 강조 (1등은 약간 더 강조)

---

## 섹션 7 — Education & Certification

### 목적
학력 + 자격증을 신뢰성 있게 전달.

### 구성 요소
- 4개 entry (CONTENT.md): CKA 진행중, 정보처리기사 진행중, SSAFY 12기 수료, 정치외교학과 학사
- 진행중 자격증은 상태 표시 (작은 라벨)

### AC
- **AC1**: "진행중" 라벨은 accent-pink 미세 사용 (포인트 컬러 활용)
- **AC2**: 행 hover 시 미세 인터랙션

---

## 섹션 8 — Guestbook (방명록) — **신규**

### 목적
방문자가 100자 이내 짧은 후기를 남길 수 있음. 본인 + 다른 방문자가 볼 수 있는 social proof.

### 구성 요소
- 입력 form:
  - 이름 (선택, 최대 20자)
  - 후기 본문 (필수, 최대 100자, 카운터 표시)
  - honeypot field (hidden, 봇용 함정)
  - 제출 버튼 + Cloudflare Turnstile (선택, 2차 도입 옵션)
- 표시 목록:
  - 최신순 10개
  - 각 entry: 본문 + (이름 또는 익명) + 시간 (예: "3일 전")
  - 더 보기 버튼 (선택)

### AC
- **AC1**: 제출 form은 키보드 접근 + label 명시
- **AC2**: 후기 카운터는 100자에 도달하면 시각적 경고 (accent-pink)
- **AC3**: 제출 후 즉시 visible은 NOT 보장 (모더레이션 대기). "검토 후 노출됩니다" 메시지 표시
- **AC4**: 표시 목록의 텍스트는 plain text only (HTML/마크다운 무시, escape 처리)
- **AC5**: rate-limit 도달 시 "잠시 후 다시 시도해주세요" 메시지
- **AC6**: 봇 honeypot 채워진 경우는 silent 200 응답 (봇이 실패 인지 못 하게)
- **AC7**: 빈 상태에서는 "첫 번째 방명록을 남겨주세요" 표시
- **AC8**: 모바일에서 입력 폼은 가독성 + 터치 타깃 적절히

### 비기능
- 클라이언트 컴포넌트 (form 인터랙션 필요)
- API 호출: POST `/api/guestbook`, GET `/api/guestbook?limit=10`
- 보안: API.md 참조

---

## 섹션 9 — Contact

### 목적
연락 가능한 경로 제공. 무거운 폼 X.

### 구성 요소
- 큰 한 줄: "Get in touch." (Schibsted Grotesk)
- 소셜 아이콘 가로 배치 (Phosphor 또는 브랜드 SVG):
  - Email (`mailto:zz262zzx@gmail.com`)
  - GitHub (juniqu-e)
  - Velog (juniqu_e)
- 폼 미사용 (Guestbook이 짧은 메시지 역할 수행)

### AC
- **AC1**: 각 아이콘은 `<a>` 태그 + 의미적 `aria-label` ("Email", "GitHub", "Velog")
- **AC2**: hover 시 색 전환 (accent-blue 또는 accent-pink)
- **AC3**: 외부 링크는 `target="_blank" rel="noopener noreferrer"`

---

## 섹션 10 — Footer

### 구성 요소
- 모토 재등장: "Try the code, Catch the people, Finally make it reliable."
- 보조 문구: "Building reliable workflows for developers, teams, and services."
- copyright + year ("© 2025 이준익")
- (선택) "Built with Next.js + Claude Code" 같은 미세 attribution

### AC
- **AC1**: 모토는 Hero와 동일한 시그니처 톤 (코드 블록은 아니어도 통일감)
- **AC2**: 시각적으로 페이지 끝 명확
- **AC3**: 카피라이트는 자동 연도 (`new Date().getFullYear()`)

---

## 페이지 라우트

| Route | 설명 | 우선순위 |
|---|---|---|
| `/` | 메인 (모든 섹션) | P0 |
| `/api/guestbook` | 방명록 API | P0 |
| `/api/og` | 동적 OG image | P1 |
| `/sitemap.xml` | SEO | P0 |
| `/robots.txt` | SEO | P0 |
| `/projects/[slug]` | 프로젝트 상세 | P2 (1차 모달, 추후 페이지) |
| `/admin/guestbook` | 관리자 (선택) | P2 (필요 시) |

---

## 우선순위 (Phase 5 시작 시점)

1. **P0 — Foundation**: layout shell + 폰트 로딩 + 디자인 토큰 (Phase 4 산출물)
2. **P0 — Hero** + **About** (시그니처 검증)
3. **P0 — Tech Stack** + **Projects** (가장 중요한 콘텐츠)
4. **P0 — Experience** + **Awards** + **Education** + **Contact** + **Footer**
5. **P1 — Guestbook** (API 포함, 가장 복잡한 단일 기능)
6. **P1 — OG image API + sitemap/robots**
7. **P2 — 프로젝트 상세 페이지**
