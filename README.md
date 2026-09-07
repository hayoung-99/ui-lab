# UI Lab

**https://hayoung-99.github.io/ui-lab/**

UI 컴포넌트와 페이지를 하나씩 만들어 보고 기록하는 실험실입니다. 실험 하나가 폴더 하나이고,
각 실험은 자기 페이지·컴포넌트·디자인 정의를 안에 품고 서로 독립돼 있습니다. 루트 페이지가
그 실험들을 나열합니다.

## 실행

```bash
yarn            # 설치
yarn dev        # http://localhost:5173/
yarn build      # tsc + vite build + 검색 엔진용 정적 HTML 생성 (dist/)
yarn preview    # 빌드 결과 미리보기
yarn lint
```

## 실험 추가하기

`src/features/` 아래에 폴더를 하나 만듭니다. 폴더 이름이 곧 URL 조각입니다.

```
src/features/<slug>/
  meta.ts      제목·설명·키워드·날짜 (React 없이 순수 데이터)
  Page.tsx     default export 컴포넌트. 셸 안의 <main> 부터 그립니다
  DESIGN.md    이 실험의 디자인 정의 (선택)
  PRODUCT.md   이 실험이 무엇인지 (선택)
  ...          컴포넌트, 자산, 도구 스크립트
```

`meta.ts` 는 `FeatureMeta`(`src/features/types.ts`) 모양의 `meta` 를 export 합니다. 여기 적은
`description` 이 검색·답변 엔진에 그대로 인용되므로 "무엇을 · 어떻게 · 무엇으로" 가 한 문장에
들어가게 씁니다. 목록 페이지와 라우트는 폴더를 자동으로 수집하므로 따로 등록할 곳은 없습니다.

테마(라이트·다크)는 셸이 관리합니다. 페이지에서는 `useTheme()` 로 읽습니다.

## 구조

```
src/
  site.ts            사이트 이름·주소·작성자 — 앱과 빌드 스크립트가 공유
  app/               셸: 라우터, 공통 레이아웃(상단 바·테마), 목록 페이지
  features/          실험들. registry.ts 가 폴더를 자동 수집
scripts/prerender.ts 빌드 뒤 route 별 정적 HTML·sitemap·robots·llms.txt 생성
DESIGN.md            셸(목록·레이아웃)의 디자인 정의. 각 실험은 자기 폴더의 것을 따름
```

## 배포

`main` 에 push 하면 GitHub Actions 가 빌드해 GitHub Pages 에 올립니다
(`.github/workflows/deploy.yml`). 저장소 이름이 곧 base 경로(`/ui-lab/`)입니다.
