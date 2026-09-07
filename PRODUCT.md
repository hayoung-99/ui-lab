# Product

<!-- impeccable:product-schema 1 -->

## Platform

web — `https://hayoung-99.github.io/ui-lab/` (GitHub Pages, 정적 배포)

## Users

- **만든 사람 본인.** UI 컴포넌트·페이지를 하나씩 만들어 보고, 브라우저에서 만져 보고, 어떻게
  만들었는지 남겨 두는 실험실입니다. 첫 번째 독자는 미래의 자신입니다.
- **링크로 들어온 다른 사람.** 목록에서 실험을 고르고, 각 실험 페이지에서 직접 만져 봅니다.
- **검색·답변·생성형 엔진.** 각 실험 페이지는 자바스크립트 없이도 제목·설명·키워드가 있는
  HTML 이며, 구조화 데이터와 `sitemap.xml`·`llms.txt` 를 갖습니다.

## Product Purpose

실험 하나가 폴더 하나(`src/features/<slug>/`)이고, 각 폴더가 자기 페이지·컴포넌트·디자인
정의(`DESIGN.md`, `PRODUCT.md`)를 품습니다. 루트는 그 실험들을 나열하는 목록 페이지이고,
공통 상단 바(사이트 이름, GitHub 링크, 테마 토글)가 셸입니다. 성공은 새 실험을 폴더 하나
만드는 것으로 추가할 수 있고, 각 실험이 서로를 모른 채 독립적으로 살고, 배포된 주소가 사람과
엔진 모두에게 읽히는 것입니다.

## Operating Context

- `yarn dev` 로 띄우면 `/` 가 목록, `/<slug>/` 가 각 실험입니다.
- `yarn build` 는 `tsc` → `vite build` → `scripts/prerender.ts` 순서로 돌아 `dist/` 에
  route 별 정적 HTML 과 부속 파일을 만듭니다.
- `main` 에 push 하면 GitHub Actions 가 빌드해 Pages 에 올립니다.
- 라이트·다크 모드는 셸의 토글로 바꾸고 초기값은 시스템 설정을 따릅니다. 페이지를 오가도
  유지됩니다.

## Capabilities and Constraints

- **셸은 실험의 내용을 모릅니다.** `src/features/registry.ts` 가 폴더를 자동 수집하고, 셸이
  아는 것은 `meta.ts` 의 데이터뿐입니다. 셸을 고칠 때 실험 코드를 건드리지 않고, 실험을 고칠
  때 셸을 건드리지 않습니다.
- **각 실험의 디자인은 그 폴더의 `DESIGN.md` 가 정합니다.** 루트 `DESIGN.md` 는 셸(상단 바,
  목록 카드)만 정의하고, 실험은 그 토큰을 상속하되 덮어쓸 수 있습니다.
- **`meta.ts` 는 React 를 import 하지 않습니다.** 빌드 스크립트가 Node 에서 그대로 읽습니다.
- **한국어 문구를 유지합니다.** 사실이 아닌 문구를 덧붙이지 않습니다.
- **라이트·다크를 둘 다 유지합니다.** 새 UI 는 두 모드에서 다 확인합니다.
- 셸의 의존성은 React 19 · react-router · TypeScript · Vite 8 · Tailwind CSS 4 입니다.
  셸에 새 의존성을 붙이는 것은 모든 실험에 영향을 주므로 신중히 합니다.

## Evidence on Hand

- 첫 실험: `src/features/liquid-metal-button/` — 자기 `PRODUCT.md`·`DESIGN.md` 를 갖습니다.
- 사용자 후기, 지표, 외부 인용은 없으며 만들어 넣지 않습니다.

## Product Principles

- 실험이 주인공이고 셸은 무대입니다. 셸은 조용해야 합니다.
- 폴더 하나로 실험이 완결됩니다. 어딘가에 등록하는 단계가 있으면 잘못된 것입니다.
- 사람이 읽는 것과 엔진이 읽는 것이 같은 문장입니다. 따로 쓰지 않습니다.
- 두 모드 모두 첫 번째 시민입니다.
