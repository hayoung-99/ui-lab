---
name: UI Practice
description: 회색 스튜디오 위에 컴포넌트 하나를 올려 두고 관찰·조절·기록하는 개인 쇼케이스
colors:
  studio-floor: '#d3d3d5'
  studio-floor-dark: '#151517'
  stage-well: '#dcdcde'
  stage-well-dark: '#1d1d21'
  glass-card: 'rgba(255, 255, 255, 0.55)'
  glass-card-dark: 'rgba(255, 255, 255, 0.04)'
  glass-edge: 'rgba(255, 255, 255, 0.6)'
  glass-edge-dark: 'rgba(255, 255, 255, 0.1)'
  ink: '#171717'
  ink-strong: '#262626'
  ink-body: '#404040'
  ink-muted: '#525252'
  ink-quiet: '#737373'
  ink-faint: '#a3a3a3'
  ink-dark: '#f5f5f5'
  ink-strong-dark: '#e5e5e5'
  ink-body-dark: '#d4d4d4'
  focus-indigo: '#6366f1'
  face-top: '#e7e7ea'
  face-bottom: '#dedee1'
  face-top-dark: '#2b2c32'
  face-bottom-dark: '#1f2025'
typography:
  display:
    fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    fontSize: '24px'
    fontWeight: 600
    lineHeight: 1.33
  title:
    fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    fontSize: '18px'
    fontWeight: 600
    lineHeight: 1.55
  body:
    fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    fontSize: '13px'
    fontWeight: 400
    lineHeight: 1.375
  caption:
    fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    fontSize: '12px'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    fontSize: '11px'
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: '0.1em'
  mono:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    fontSize: '12px'
    fontWeight: 400
    lineHeight: 1.5
rounded:
  chip: '4px'
  card: '24px'
  stage: '64px'
  pill: '999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
  stage: '48px'
  column: '64px'
components:
  card:
    backgroundColor: '{colors.glass-card}'
    textColor: '{colors.ink}'
    rounded: '{rounded.card}'
    padding: '24px'
    width: '360px'
  stage:
    backgroundColor: '{colors.stage-well}'
    rounded: '{rounded.stage}'
    padding: '48px'
  button-ghost-pill:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-muted}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '4px 12px'
  code-chip:
    backgroundColor: 'rgba(0, 0, 0, 0.06)'
    textColor: '{colors.ink-body}'
    typography: '{typography.mono}'
    rounded: '{rounded.chip}'
    padding: '1px 4px'
---

# Design System: UI Practice

## Overview

이 문서는 Liquid Metal Button feature 한 화면의 디자인입니다. 공통 상단 바(사이트 이름, 테마
토글)와 목록 페이지는 저장소 루트의 `DESIGN.md` 가 정합니다. 이 문서는 그 셸의 토큰을 그대로
상속하고, 여기서 정한 것(무대, 조절 패널, 스펙 카드)만 덧붙입니다.

**Creative North Star: "제품 촬영 스튜디오"**

무광 회색 배경지(스튜디오 플로어) 위에 오브젝트 하나를 올려 두고 조명을 맞추는 장면입니다.
화면의 주인공은 항상 컴포넌트이고, 나머지 요소(조절 패널, 스펙 카드)는 촬영 스태프처럼
옆에서 조용히 일합니다. 배경은 색을 갖지 않아 금속 링의 무지개 프린지가 유일한 채도가 됩니다.
카드는 반투명 유리이고, 컴포넌트가 놓이는 무대는 배경보다 살짝 밝은 움푹한 접시입니다.

밀도는 편안한 쪽입니다. 카드 안 행간은 촘촘하지만 카드끼리는 넉넉히 떨어져 있고, 라벨은 작은
대문자 트래킹으로 소리를 낮춥니다. 라이트·다크 모드는 같은 스튜디오의 낮과 밤이며, 양쪽 모두
동일한 구조를 유지한 채 밝기만 뒤집습니다.

**Key Characteristics:**

- 무채색 배경지 위 단 하나의 채도(버튼 링의 무지개)
- 반투명 유리 카드와 큰 둥근 모서리(24px 카드, 64px 무대, 999px 알약)
- 작은 대문자 라벨(11px, 0.1em 트래킹)이 섹션을 여는 목소리
- 값과 파일명은 모노스페이스, 나머지는 시스템 산세리프
- 라이트와 다크가 대칭인 구조

## Colors

채도 없는 회색 스케일이 전부이고, 색은 컴포넌트 자신과 포커스 링에만 있습니다.

### Primary

- **Focus Indigo** (`{colors.focus-indigo}`): 키보드 포커스 링에만 씁니다. 화면에서 유일하게 의도된 색이며 다른 어디에도 쓰지 않습니다.

### Neutral

- **Studio Floor** (`{colors.studio-floor}` / 다크 `{colors.studio-floor-dark}`): 페이지 전체 배경. 순백도 순흑도 아닌 무광 회색 배경지입니다.
- **Stage Well** (`{colors.stage-well}` / 다크 `{colors.stage-well-dark}`): 컴포넌트가 놓이는 움푹한 접시. 배경보다 라이트에서는 3% 밝고 다크에서는 3% 밝습니다.
- **Glass Card** (`{colors.glass-card}` / 다크 `{colors.glass-card-dark}`): 반투명 카드 면. 흰색 55% 위에 8px 블러를 얹습니다. 다크에서는 흰색 4% 만 남깁니다.
- **Glass Edge** (`{colors.glass-edge}` / 다크 `{colors.glass-edge-dark}`): 카드 테두리와 하이라이트 선. 유리의 두께를 암시합니다.
- **Ink 계열**: 본문 텍스트는 `{colors.ink-strong}`, 슬라이더 라벨은 `{colors.ink-body}`, 라벨·설명은 `{colors.ink-muted}`~`{colors.ink-quiet}`, 기본값 상태의 숫자와 눈금은 `{colors.ink-faint}`. 다크에서는 `{colors.ink-dark}`~`{colors.ink-body-dark}` 로 뒤집습니다.
- **Face** (`{colors.face-top}`→`{colors.face-bottom}` / 다크 `{colors.face-top-dark}`→`{colors.face-bottom-dark}`): 버튼 면의 위아래 그라디언트. 컴포넌트 소유이므로 화면 쪽에서 재사용하지 않습니다.

### Named Rules

**The Grey Backdrop Rule.** 배경·카드·텍스트는 전부 무채색입니다. 채도는 컴포넌트가 스스로 가져오는 것이지 무대가 주는 것이 아닙니다.
**The One Indigo Rule.** `{colors.focus-indigo}` 는 포커스 링 전용입니다. 강조·링크·활성 상태에 빌려 쓰지 않습니다.

## Typography

**Display Font:** 시스템 산세리프 (`ui-sans-serif, system-ui`)
**Body Font:** 같은 시스템 산세리프
**Label/Mono Font:** 시스템 모노스페이스 (`ui-monospace, SFMono-Regular, Menlo`)

**Character:** 웹폰트 없이 시스템 글꼴만 씁니다. 개성은 글꼴이 아니라 크기 대비와 대문자 트래킹, 그리고 값이 나올 때마다 모노스페이스로 바꾸는 규칙에서 나옵니다.

### Hierarchy

- **Display** (600, 24px, 1.33): 컴포넌트 이름 ("Liquid Metal Button"). 화면에 하나뿐입니다.
- **Title** (600, 18px, 1.55): 카드 제목 ("LiquidMetalButton").
- **Body** (400, 13px, 1.375): 스펙 값, 슬라이더 라벨, 카드 설명. 92px 라벨 열과 값 열의 2열 그리드로 배치합니다.
- **Caption** (400, 12px, 1.5): 보조 설명 ("슬라이더를 더블클릭하면 그 값만 기본으로").
- **Label** (600, 11px, 0.1em, 대문자): 섹션 헤더 ("Spec", "Controls", "Rendering"). 회색 `{colors.ink-quiet}` 로 낮게 깔립니다.
- **Mono** (400, 12px / 눈금 10px): 슬라이더 현재값, 코드 칩, 파일명, 생성·수정일. `tabular-nums` 를 켭니다.
  제목줄의 날짜는 "생성 YYYY-MM-DD"이고, 수정일이 생성일과 다를 때만 "· 수정 YYYY-MM-DD"를
  덧붙입니다(레이블은 산세리프, 값만 모노).

### Named Rules

**The Mono Value Rule.** 숫자·파일명·prop 이름처럼 복사해 쓸 수 있는 것은 전부 모노스페이스입니다. 설명 문장은 산세리프로 남깁니다.
**The Changed-Value Rule.** 기본값에서 벗어난 슬라이더 값만 진한 잉크로, 기본값 그대로인 것은 `{colors.ink-faint}` 로 둡니다. 무엇을 건드렸는지 색이 말합니다.

## Layout

뷰포트 가운데에 콘텐츠를 모읍니다(`min-height: 100vh`, flex 중앙 정렬, 좌우 32px·상하 48px 패딩).
셸이 준 1180px 컨테이너 안에서 제목줄 → 무대+조절 패널 → 스펙 카드가 세로로 쌓입니다.
"목록으로" 링크·GitHub 링크·테마 토글은 셸 상단 바가 그리므로(같은 줄, 왼쪽에 목록으로·
오른쪽에 GitHub+테마) 이 화면에서는 다시 그리지 않습니다. 무대와 조절 패널은 `lg`(1024px)
이상에서 좌우 2열이 됩니다. 두 열 사이는 40px, `lg` 에서 64px 입니다. 카드 폭은 360px
고정이며 무대는 내용 크기에 맞춥니다.

카드 안에서는 16px 이 리듬 단위입니다: 슬라이더 사이 16px, 헤더 아래 16~20px, 스펙 행 사이 6px,
아코디언 본문 아래 16px.

### Spec 그리드

그룹(Rendering·Data·Behavior·Stack)을 세로로 쌓지 않고 4열 그리드로 펼쳐 카드 전체 너비를
씁니다(좁은 화면은 2열). 그룹마다 라벨이 위, 칩이 아래로 오는 세로 흐름은 유지합니다.

## Elevation & Depth

하이브리드입니다. 카드는 위로 떠 있고(짙은 확산 그림자 + 위쪽 1px 흰 하이라이트), 무대는
아래로 파여 있습니다(안쪽 그림자). 두 방향이 만나 "유리 카드가 배경지 위에 놓이고, 오브젝트는
배경지에 살짝 눌려 있다"는 장면을 만듭니다. 그림자는 전부 무채색이고 색을 띠지 않습니다.

### Shadow Vocabulary

- **Glass lift** (`box-shadow: 0 1px 0 rgba(255,255,255,0.7), 0 20px 40px -24px rgba(0,0,0,0.35)`, 다크 `0 20px 40px -24px rgba(0,0,0,0.8)`): 카드. 위쪽 흰 선이 유리 윗면, 아래 확산이 바닥 그림자입니다.
- **Stage well** (`box-shadow: inset 0 2px 10px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.6)`, 다크 `inset 0 2px 10px rgba(0,0,0,0.5)`): 무대. 안쪽 그림자로 파인 접시를 만듭니다.
- **Backdrop blur** (`backdrop-filter: blur(8px)`): 카드에만 씁니다.

### Named Rules

**The Lift-and-Well Rule.** 정보는 떠 있고(카드) 오브젝트는 놓여 있습니다(무대). 카드에 안쪽 그림자를, 무대에 확산 그림자를 주지 않습니다.

## Shapes

둥근 것이 전부입니다. 카드 24px, 무대 64px, 버튼·칩·초기화는 완전 알약(999px), 코드 칩만 4px.
테두리는 1px 이고 항상 반투명 흰색이라 선이 아니라 유리 가장자리로 읽힙니다. 아이콘은 1.8px 선의
둥근 끝 chevron 하나뿐이며, 아코디언이 열리면 180° 회전합니다.

## Components

### Buttons

- **Shape:** 완전 알약 (999px)
- **Ghost pill** (테마 토글, 초기화): 투명 배경, 1px `rgba(163,163,163,0.5)` 테두리, 11~12px `{colors.ink-muted}` 텍스트, 패딩 4px 12px. 호버 시 `rgba(255,255,255,0.4)` 채움, 다크에서는 `rgba(255,255,255,0.1)`. 비활성은 opacity 0.4 와 기본 커서.
- **Focus:** 2px `{colors.focus-indigo}` 아웃라인, 오프셋 3px.

### Cards / Containers

- **Corner Style:** 24px
- **Background:** `{colors.glass-card}` + 8px 블러
- **Shadow Strategy:** Glass lift
- **Border:** 1px `{colors.glass-edge}`
- **Internal Padding:** 24px
- **Header:** Label(대문자) → Title → Caption 순서로 쌓고 아래 16~20px 여백

### Inputs / Fields

- **Range slider:** 높이 6px, 완전 알약 트랙 `rgba(0,0,0,0.1)`(다크 `rgba(255,255,255,0.15)`), 손잡이는 `accent-color` 로 `{colors.ink-strong}`(다크 `{colors.ink-strong-dark}`). 위에 라벨과 현재값(모노, 오른쪽 정렬), 아래에 최소·최대 눈금(모노 10px `{colors.ink-faint}`). 더블클릭으로 기본값 복귀.

### Accordion (Spec Section)

- 네이티브 `<details>`. 헤더는 Label 스타일에 chevron, 위쪽 1px `rgba(0,0,0,0.08)` 구분선(첫 항목 제외). 본문은 92px 라벨 + 값의 2열 그리드, 행 간격 6px.

### Stage

- 64px 둥근 접시, `{colors.stage-well}`, 48px 패딩, Stage well 그림자. 컴포넌트를 정확히 가운데 놓습니다.

### LiquidMetalButton (Signature)

이 화면의 주인공이자 보존 대상입니다. 면은 `{colors.face-top}`→`{colors.face-bottom}` 그라디언트, 24px 96px 패딩, 7px 링(WebGL 텍스처 재생, 폴백은 CSS conic-gradient 크롬). 호버 시 그림자가 조금 커지고, 눌리면 `scale(0.97)`. 다크 모드는 컴포넌트가 `data-theme` 로 스스로 처리합니다. 화면 쪽 디자인 작업에서 이 컴포넌트의 CSS 를 건드리지 않습니다.

## Do's and Don'ts

### Do:

- **Do** 배경·카드·텍스트를 무채색으로 유지하고 채도는 컴포넌트에 맡깁니다.
- **Do** 값·파일명·prop 이름은 모노스페이스로, 문장은 산세리프로 씁니다.
- **Do** 새 UI 를 라이트와 다크 양쪽에서 확인하고, 다크는 `<html class="dark">` 변형(`dark:`)으로 씁니다.
- **Do** 섹션은 11px 대문자 트래킹 라벨로 엽니다.
- **Do** 카드는 Glass lift, 무대는 Stage well 그림자를 씁니다.

### Don't:

- **Don't** `src/features/liquid-metal-button/LiquidMetalButton/` 의 스타일이나 동작을 화면 디자인 작업에서 바꾸지 않습니다.
- **Don't** `{colors.focus-indigo}` 를 포커스 링 밖에서 쓰지 않습니다.
- **Don't** 웹폰트나 새 패키지를 들이지 않습니다.
- **Don't** 한국어 카피를 바꾸거나 사실이 아닌 문구를 덧붙이지 않습니다.
- **Don't** 카드에 불투명 흰색·검정 배경을 주지 않습니다. 유리는 항상 반투명입니다.
