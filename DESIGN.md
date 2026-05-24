# Portfolio Design System

본 문서는 wnsdlr.com 포트폴리오의 디자인 컨셉과 규칙을 정의한다. 모든 UI 결정은 이 문서를 기준으로 한다.

## 컨셉

### Three Adjectives
1. **편안한** (calm) — 시각적 부담 없는 차분한 베이스
2. **정제된** (refined) — 콘텐츠가 주인공, 장식은 최소
3. **개인적인** (personal, dynamic) — 정적이지 않은, 손이 닿으면 반응하는

### Core Thesis
> 정지된 화면은 차분하다. 그러나 손이 닿는 순간 즉각 응답한다.

차분한 베이스 위에 다이나믹 인터랙션 레이어. 본인의 성격(논리적·차분함)을 시각적으로 표현하되, 정적인 느낌은 피하고 빠릿한 액션으로 열정을 드러낸다.

레퍼런스 톤: Linear.app, Stripe.com, Vercel.com — 클린한 베이스 + 샤프한 마이크로 인터랙션.

---

## 컬러

라이트모드 전용 (다크모드 미지원, 추후 필요시 추가).

### Tokens

```
--bg-base       #FFFFFF   순백
--bg-subtle     #FAFAFA   섹션 구분용 약간 다른 화이트
--text-primary  #0A0A0A   본문/제목
--text-muted    #595959   부가 정보
--text-subtle   #8E8E8E   메타 정보, 캡션
--border        #EDEDED   디바이더, 카드 보더
--border-strong #D4D4D4   강조 보더

--accent-blue   #6B9BD2   soft cornflower
--accent-pink   #E8A5B7   soft rose
```

### 사용 규칙

- **포인트 컬러 면적은 전체의 10% 미만 유지**. 도배 금지.
- **블루**: 링크, 호버 포커스, 강조 텍스트 1~2단어
- **핑크**: 액션 강조 (CTA 호버 등), 아이콘 보조색
- **블루→핑크 그라데이션은 단 1곳만**. 예: 이름 글자, 페이지 구분 점, 기타 시그니처 1포인트. 절대 도배 X.
- 그라데이션을 배경 전면이나 카드 보더에 두르지 말 것.

---

## 타이포그래피

### Fonts

| 용도 | 폰트 | 비고 |
|---|---|---|
| Body | **Pretendard** | 한국어 가독성 최상, 다국어 |
| Display | **Schibsted Grotesk** | 큰 영문 타이틀, 모던 지오메트릭 |
| Mono | **JetBrains Mono** | 코드, 스택 표기 |

- Pretendard: variable font 사용 (`PretendardVariable.woff2`)
- Display는 영문 헤더에만, 한글 헤더는 Pretendard Bold/Black

### Scale (Tailwind 단위 기준)

```
text-xs      0.75rem   12px   캡션
text-sm      0.875rem  14px   메타 정보
text-base    1rem      16px   본문 (기본)
text-lg      1.125rem  18px   본문 강조
text-xl      1.25rem   20px   서브 헤딩
text-2xl     1.5rem    24px   섹션 제목
text-4xl     2.25rem   36px   페이지 제목
text-6xl     3.75rem   60px   히어로 제목 (Display)
text-8xl     6rem      96px   히어로 거대 텍스트 (드물게)
```

### 위계 만들기
- 색 의존 금지. 크기/굵기/여백으로 위계.
- Display는 letter-spacing 약간 좁게 (`-0.02em`), Body는 기본.

---

## 레이아웃 & 스페이싱

### 원칙
- 수직 스크롤 + 명확한 섹션 구분.
- 화려한 네비게이션 없음. 상단 고정 헤더 미니멀 or 사이드 인덱스.
- 모바일 우선 (mobile-first). breakpoint: `sm 640 / md 768 / lg 1024 / xl 1280`.
- 본문 최대 너비 `max-w-4xl` (~896px). 카드/그리드는 더 넓게.

### 그리드
- Skills: 4~6 columns (desktop) / 2 (mobile) — 아이콘 그리드
- Projects: 2 columns (desktop) / 1 (mobile) — 이미지 카드
- 갭은 항상 `gap-6` (24px) 또는 `gap-8` (32px) 고정.

### 여백
- 섹션 사이: `py-24` (96px) 이상
- 모바일은 `py-16`
- 본문 사이즈 적절히, 압박감 없게

---

## 아이콘 전략

### 라이브러리

| 종류 | 사용 |
|---|---|
| **Phosphor Icons** | 정적 아이콘 전반 (UI, 메타) |
| **Lordicon** | 액션/포인트 자리에 애니메이션 아이콘 |
| Lottie 직접 | 특수 위치 (히어로, 트랜지션) |

### 사용 규칙
- **기본 lucide/heroicons 사용 금지**. 시각적 정체성 약화시킴.
- Phosphor weight는 프로젝트 전체에서 **하나로 통일** (추천: `Regular` 또는 `Duotone`)
- Lordicon은 호버 시 1회 재생. 자동 반복 금지 (시각 노이즈).
- 한 페이지에 Lordicon은 최대 5~6개. 너무 많으면 베이스의 차분함 해침.

---

## 인터랙션 & 모션

### 원칙
- **모든 트랜지션 0.15~0.3초**. 길게 끌지 말 것.
- **이징은 ease-out 통일** (`cubic-bezier(0.16, 1, 0.3, 1)` 권장).
- **fade-up scroll trigger 금지**. AI 클리셰. 대신 짧고 샤프한 슬라이드 또는 즉시 표시.
- **mouse-follow blob, glassmorphism, 그라데이션 도배 금지**.

### 패턴 카탈로그

| 위치 | 모션 |
|---|---|
| 프로젝트 카드 호버 | `scale(1.02)` + 보더 컬러 전환 + 미세 그림자 (0.2s) |
| 스킬 아이콘 호버 | Lordicon 1회 재생 |
| 버튼/링크 호버 | 색 즉각 전환 + 1px 좌측 이동 |
| 페이지 트랜지션 | View Transitions API (모핑) 또는 0.2s 페이드 |
| 섹션 진입 | 매우 짧은 슬라이드 (0.3s 이내). 도배 NO |
| 시그니처 포인트 | 호버 시 블루→핑크 미세 그라데이션 (밑줄 등) |
| 커스텀 커서 (선택) | 특정 섹션에서만 미세하게 커진 dot |

### 라이브러리
- **Framer Motion** (Motion) — 메인 애니메이션
- **CSS transitions** — 단순 호버
- **View Transitions API** — 페이지 전환

---

## 시그니처 요소 (Signature Elements)

본인의 정체성을 시각적으로 anchoring 하는 요소들. 사이트 전반에 반복되어 등장.

### 1. The try/catch/finally code block

가장 중요한 시그니처. 본인 모토를 코드 블록으로 표현.

```ts
try {
  code();
} catch (people) {
  communicate();
  growTogether();
} finally {
  shipReliableService();
}
```

**규칙**:
- JetBrains Mono 폰트
- syntax highlighting 적용 (키워드는 accent-blue, 함수는 text-primary, 문자열은 accent-pink 등)
- Hero 또는 About에 반드시 노출. 단순 텍스트로 흘리지 말 것.
- Footer에서도 한 번 더 등장 (mini 버전)
- 사이트에서 가장 distinctive한 시각 요소가 되도록 충분한 크기

### 2. Motto tagline

> **Try the code, Catch the people, Finally make it reliable.**

- Hero, Footer, Meta description에 반복
- 영문 표기는 Schibsted Grotesk
- 한글 풀이("코드로 도전하고, 사람과 소통하며...")는 About 도입부에

### 3. Blue→Pink 시그니처 그라데이션

- 단 한 곳에만 사용 (예: 이름 글자, 또는 try/catch/finally 코드 블록의 상단 보더 라인 1줄)
- 절대 도배 금지

---

## 섹션 구성 (CONTENT.md 기반)

CONTENT.md의 실제 콘텐츠에 맞게 정렬. 시각/아이콘 중심 + 시그니처 요소 반복 활용.

### 1. Hero
- 좌측 상단: 이름 `이준익 / Lee Junik` (Schibsted Grotesk 큰 영문 + Pretendard 한글)
- 그 아래: 역할 라벨 `DevOps / Platform Engineer`
- 중앙/우측: **try/catch/finally 코드 블록** (시그니처 1번, 크게)
- 하단: 모토 한 줄 "Try the code, Catch the people, Finally make it reliable."
- 스크롤 유도: 미니멀 `↓` 아이콘

### 2. About
- 자기소개 문단 (CONTENT.md About Me 본문)
- **정체성 요약 표**: Role / Interest / Current / Certification / Motto (테이블 또는 카드 그리드)
- 키워드 아이콘 그리드는 NOT 별도 추가 (이미 콘텐츠 풍부)

### 3. Tech Stack
- 6개 카테고리 그룹:
  - DevOps / Platform (가장 위, 정체성 우선)
  - Cloud / Infrastructure
  - Languages
  - Frontend / Mobile
  - Backend
  - Tools & Collaboration
- 각 그룹: 카테고리 제목 + 아이콘 그리드 (4~6 col desktop / 2~3 col mobile)
- 각 아이콘: 공식 브랜드 SVG 또는 Phosphor `Regular`
- 호버 시: Lordicon 재생 또는 미세 scale + 색 전환
- 진행도 바(%) 절대 금지. 텍스트 라벨은 아이콘 아래 작게

### 4. Experience
- 단일 엔트리 (현재): SSAFY 13기·14기 실습코치
- 좌측: 기관 로고 (또는 placeholder) + 기간 + 역할
- 우측: 본문 paragraph + 주요 업무 테이블
- 향후 경력 추가 시 비주얼 타임라인으로 확장

### 5. Featured Projects
**4개 그룹 헤더로 시각 구분**: `In Progress` / `In Operation` / `Developer Tools` / `Mobile`
- 그룹 헤더는 작은 라벨 또는 컬러 도트로 분류 (capsule-render 그라데이션 헤더는 GitHub 전용. 웹에서는 미세한 텍스트 + 라벨로)
- 각 프로젝트 카드: 큰 썸네일/스크린샷 + 제목 + 한 줄 설명 + 수상/역할 라벨 + 스택 태그
- 호버 시: 카드 scale(1.02) + 보더 컬러 전환
- 클릭 시: 상세 페이지 또는 모달
- **수상 프로젝트 (PADING, WhistleHub, Amoverse)는 라벨로 강조** — 작은 trophy 아이콘 + 등수
- 상세는 problem → solution → tech 내러티브 구조

### 6. Awards
- 3개 수상 테이블 또는 미니 카드 행
- 시각적으로 무겁지 않게, 그러나 분명하게 강조
- trophy 아이콘 일관 사용

### 7. Education & Certification
- 4개 엔트리 테이블
- Certification 진행중 상태 표시 (작은 라벨 또는 progress 인디케이터)
- Education은 SSAFY 12기 수료 + 정치외교학과 (story-supporting)

### 8. Contact
- 큰 한 줄: "Get in touch." (Schibsted Grotesk)
- 소셜 아이콘 가로 배치 (Phosphor 또는 공식 브랜드): Email, GitHub, Velog
- 폼 미사용 (가벼움 유지)
- 이메일 클릭 시 메일 클라이언트 오픈

### 9. Footer
- 모토 재등장: "Try the code, Catch the people, Finally make it reliable."
- 보조 문구: "Building reliable workflows for developers, teams, and services."
- copyright + year

---

## 안티패턴 (절대 금지)

- ❌ shadcn 디폴트 다크모드 + 보라 그라데이션
- ❌ glassmorphism (frosted glass blur 카드)
- ❌ 스킬 진행도 바 (%, 별점, 원 그래프)
- ❌ 마우스 따라다니는 blob
- ❌ 모든 섹션 fade-up scroll trigger
- ❌ 자동 반복 애니메이션 (시각 노이즈)
- ❌ 이모지 폭격 / 아이콘 폭격
- ❌ 그라데이션 배경 전면, 카드 보더 그라데이션 도배
- ❌ "Modern. Clean. Professional." placeholder 톤
- ❌ Lorem ipsum (반드시 실제 콘텐츠로)
- ❌ 기본 lucide/heroicons 메인 사용
- ❌ Inter 폰트로만 모든 처리

---

## 레퍼런스 사이트 (분석 기반)

분석에서 끌어낸 패턴들:
- [mattwilldev.com](https://mattwilldev.com/) — 절제된 위계, 카테고리식 스킬
- [leejeongmin.vercel.app](https://leejeongmin.vercel.app/) — 클린 이력서식, 진정성
- [cdg-portfolio.com](https://cdg-portfolio.com/) — 본질 집중, 흑백 자신감
- [leeboa.com](https://www.leeboa.com/project/personal) — 포인트 컬러 세련된 사용 (사용자 추천)
- [savinpark.github.io/portfolio](https://savinpark.github.io/portfolio/) — 포인트 컬러 세련된 사용 (사용자 추천)

---

## 향후 결정 보류 항목

- 유료 아이콘 팩 도입 (Streamline / Untitled UI Icons) — 콘텐츠 채운 뒤 재검토
- 다크모드 추가 — 라이트모드 안정화 후
- 커스텀 커서 도입 여부 — Hero 구현 시점에 결정
- 시그니처 일러스트/Lottie 제작 — 본인이 직접 제작 or 외주
