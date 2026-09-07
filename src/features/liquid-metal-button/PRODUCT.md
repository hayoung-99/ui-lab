# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

만든 사람 본인이 첫 번째 사용자입니다. 자신이 구현한 UI 컴포넌트를 브라우저에서 직접
확인하고, 파라미터를 바꿔 가며 동작을 관찰하고, 구현 방식을 기록해 두는 화면입니다.
`https://hayoung-99.github.io/ui-lab/liquid-metal-button/` 에 공개돼 있어 링크로 받은
다른 사람과 검색·답변 엔진도 읽습니다. 그들에게는 "무엇을 어떻게 만들었나" 가 한 화면에서
읽히는 것이 목표입니다.

## Product Purpose

UI Lab(`ui-lab`)의 첫 번째 feature. `LiquidMetalButton` 을 무대에 올린 쇼케이스이며, 레퍼런스
영상을 "둘레 × 시간" 텍스처로 구워 WebGL 로 재생하는 액체 금속 링 버튼입니다.
성공은 버튼이 의도대로 보이고, 조절값을 바꿔 보며 특성을 파악할 수 있고, 나중에
다시 봐도 어떻게 만들었는지 스펙 카드만으로 떠올릴 수 있는 것입니다.

## Positioning

three.js 없이 순수 WebGL2 와 단일 텍스처(512×594, 164KB)로 레퍼런스 영상의 링을
재현하고, 다크 모드에서는 셰이더가 sRGB 밝기만 반전해 무지개 색차를 보존합니다.
버튼 면과 글자는 HTML 이라 접근성과 텍스트 렌더링을 그대로 유지합니다.

## Operating Context

- `yarn dev` (Vite, 기본 포트 5173) 로 띄우고 `/liquid-metal-button/` 에서 봅니다. 배포본은
  `https://hayoung-99.github.io/ui-lab/liquid-metal-button/` 입니다.
- 화면은 세 덩어리입니다: 버튼 무대(`Elements` 버튼), 조절 패널(링 두께·재생 속도·
  밝기·대비·채도·색조 슬라이더, 초기화), 스펙 카드(Rendering / Data / Behavior /
  Stack 아코디언).
- 라이트·다크 모드는 셸(공통 상단 바)의 토글로 바꾸며, 초기값은 시스템 설정을 따릅니다.
  토글 자체는 이 feature 가 아니라 루트 `PRODUCT.md`·`DESIGN.md` 가 정의하는 셸의 것입니다.

## Capabilities and Constraints

- **버튼 자체는 건드리지 않습니다.** `src/features/liquid-metal-button/LiquidMetalButton/` 의 WebGL
  링, 글자, 동작(prop API, reduced-motion 정지, CSS conic-gradient 폴백)은 이후
  디자인 작업의 대상이 아니라 보존 대상입니다. 바꾸는 것은 그 주변 화면입니다.
- **한국어 문구를 유지합니다.** 스펙 카드와 조절 패널의 카피는 구현 사실을
  기록한 것이라 임의로 바꾸거나 영어로 바꾸지 않습니다. 사실이 아닌 문구를 새로
  덧붙이지 않습니다.
- **라이트·다크 모드를 둘 다 유지합니다.** 토글과 시스템 설정 연동을 계속 지원하고,
  모든 새 UI 는 두 모드에서 다 확인합니다.
- **이 feature 안에서는 새 의존성을 붙이지 않습니다.** React 19 · TypeScript · Vite 8 ·
  Tailwind CSS 4 (그리고 셸이 쓰는 react-router) 안에서 해결합니다.
- 스펙 카드의 수치(텍스처 크기, 번들 크기, 주기 등)는 실제 구현에서 나온 값이며,
  `REFERENCE_PERIOD` 처럼 코드에서 읽어 오는 값도 있습니다.

## Evidence on Hand

- 실제 동작하는 컴포넌트: `src/features/liquid-metal-button/LiquidMetalButton/` (TSX, CSS, 텍스처
  `rim-reference.png`, `rim-spec.ts`).
- 텍스처 생성 도구: 이 폴더의 `scripts/` 에 있는 `frames.swift`, `build_rim_texture.py`.
- 사용자 후기, 지표, 외부 인용은 없으며 앞으로도 만들어 넣지 않습니다.

## Product Principles

- 컴포넌트가 주인공이고 나머지는 그것을 잘 보이게 하는 무대입니다.
- 조절 패널은 관찰 도구입니다. 어떤 값이 기본에서 벗어났는지 한눈에 보여야 합니다.
- 스펙 카드는 미래의 자신을 위한 기록입니다. 정확한 값과 파일 이름이 장식보다 중요합니다.
- 두 모드 모두 첫 번째 시민입니다. 한쪽에서만 예쁜 화면은 완성이 아닙니다.
