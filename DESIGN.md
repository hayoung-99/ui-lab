---
name: UI Lab
description: 회색 스튜디오 배경지 위에 실험들을 유리 카드로 늘어놓는 셸 — 상단 바와 목록 페이지
colors:
  studio-floor: "#d3d3d5"
  studio-floor-dark: "#151517"
  glass-card: "rgba(255, 255, 255, 0.55)"
  glass-card-dark: "rgba(255, 255, 255, 0.04)"
  glass-edge: "rgba(255, 255, 255, 0.6)"
  glass-edge-dark: "rgba(255, 255, 255, 0.1)"
  ink: "#171717"
  ink-strong: "#262626"
  ink-body: "#404040"
  ink-muted: "#525252"
  ink-quiet: "#737373"
  ink-faint: "#a3a3a3"
  ink-dark: "#f5f5f5"
  ink-strong-dark: "#e5e5e5"
  ink-body-dark: "#d4d4d4"
  focus-indigo: "#6366f1"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.33
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.55
  brand:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    letterSpacing: "0.025em"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.1em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  card: "24px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  page-x: "24px"
  page-y: "40px"
components:
  card:
    backgroundColor: "{colors.glass-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  button-ghost-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  keyword-chip:
    backgroundColor: "rgba(255, 255, 255, 0.4)"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: UI Lab (셸)

## Overview

이 문서는 **셸**의 디자인입니다 — 모든 페이지 위에 얹히는 상단 바와, 실험들을 나열하는 목록
페이지. 각 실험의 화면은 그 폴더의 `DESIGN.md` 가 정하며, 여기 적힌 토큰을 상속하되 덮어쓸 수
있습니다. 셸이 실험보다 눈에 띄면 잘못된 것입니다.

**Creative North Star: "제품 촬영 스튜디오의 복도"**

무광 회색 배경지(스튜디오 플로어)가 모든 방에 깔려 있고, 상단 바는 문패처럼 작고 조용합니다.
목록 페이지는 각 실험을 반투명 유리 카드로 늘어놓은 진열대입니다. 배경·카드·글자는 전부
무채색이라, 채도는 각 실험이 자기 화면에서 스스로 가져옵니다. 라이트·다크는 같은 복도의 낮과
밤이며 구조는 같고 밝기만 뒤집힙니다.

**Key Characteristics:**
- 무채색 배경지 위 유리 카드, 24px 모서리, 완전 알약 버튼·칩
- 상단 바는 왼쪽에 사이트 이름 한 단어, 오른쪽에 ghost pill 몇 개 — 그 이상 두지 않음
- 작은 대문자 라벨(11px, 0.1em)이 섹션과 설명을 엽니다
- 날짜·값은 모노스페이스, 문장은 시스템 산세리프
- 라이트와 다크가 대칭

## Colors

무채색 스케일만 씁니다. `{colors.focus-indigo}` 는 키보드 포커스 링 전용이고 그 밖의 색은 셸에
없습니다.

- **Studio Floor** (`{colors.studio-floor}` / 다크 `{colors.studio-floor-dark}`): 페이지 배경.
  `body` 에도 같은 색을 깔아 자바스크립트가 뜨기 전에도 배경지가 보입니다.
- **Glass Card / Edge**: 목록 카드의 면과 테두리. 흰색 55% 위에 8px 블러, 다크에서는 4%.
- **Ink 계열**: 사이트 이름과 제목은 `{colors.ink-strong}`, 본문은 `{colors.ink-muted}`,
  라벨·날짜는 `{colors.ink-quiet}`. 다크에서는 `{colors.ink-dark}`~`{colors.ink-body-dark}`.

**The Grey Backdrop Rule.** 셸은 색을 갖지 않습니다. 채도는 실험의 몫입니다.

## Typography

시스템 글꼴만 씁니다. 개성은 크기 대비와 대문자 트래킹, 값이 나올 때 모노스페이스로 바꾸는
규칙에서 나옵니다.

- **Brand** (600, 14px, 0.025em): 상단 바의 "UI Lab". 링크이며 홈으로 갑니다.
- **Display** (600, 24px): 목록 페이지의 h1. 화면에 하나.
- **Title** (600, 18px): 카드 제목. 실험 페이지로 가는 링크입니다.
- **Body** (400, 13px, 1.625): 사이트 설명, 카드 요약. 640px 를 넘기지 않습니다.
- **Label** (600, 11px, 대문자, 0.1em): 설명 위의 한 줄("Hayoung 의 인터랙티브 UI 저장소").
- **Mono** (400, 11~12px): 날짜(`<time>`).

**The Mono Value Rule.** 날짜·파일명·값은 모노스페이스, 문장은 산세리프.

## Layout

`min-height: 100vh` 배경 위에 1180px 컨테이너를 가운데 두고, 좌우 24px(sm 이상 32px)·상하
40px 패딩. 컨테이너 안은 세로 스택이며 상단 바 → 페이지 순서로 32px 간격입니다. 실험 페이지는
이 컨테이너 안에서 `<main>` 부터 그립니다.

목록 페이지는 h1 블록 아래에 카드 그리드: 1열 → `sm` 2열 → `lg` 3열, 간격 24px. 카드는 세로
flex 로 날짜 → 제목 → 요약 → 키워드 칩이 쌓이고, 칩은 `margin-top: auto` 로 바닥에 붙어 카드
높이가 달라도 줄이 맞습니다.

## Elevation & Depth

카드는 위로 떠 있습니다 (Glass lift: `0 1px 0 rgba(255,255,255,0.7), 0 20px 40px -24px
rgba(0,0,0,0.35)`, 다크 `0 20px 40px -24px rgba(0,0,0,0.8)`). 상단 바는 그림자가 없고 배경지
위에 그냥 놓입니다. 셸에는 안쪽 그림자(무대)가 없습니다 — 무대는 실험의 것입니다.

## Components

### 상단 바
- 왼쪽: 목록 페이지에서는 Brand 링크("UI Lab"), 실험 페이지에서는 그 자리에 "← 목록으로"
  링크(ghost pill, chevron-left + 텍스트)가 대신 옵니다 — 어느 쪽이든 홈으로 가는 링크라
  같은 자리에 하나만 둡니다.
- 오른쪽: `<nav>` 안에 GitHub 링크(ghost pill, 아이콘 14px + 텍스트) 하나와 테마 스위치 —
  모든 페이지에서 둘 다 보이고, `ml-auto`로 항상 같은 줄 오른쪽에 고정됩니다.
- GitHub 링크의 라벨과 주소는 현재 페이지를 따릅니다: 목록 페이지에서는 "ui-lab" → 저장소
  루트, 실험 페이지에서는 그 실험의 제목 → `저장소/tree/main/src/features/<slug>` 디렉터리.
  실험 화면은 자기가 어느 GitHub 주소로 이어질지 알 필요가 없고, 셸이 라우트로 계산합니다.
- 폭이 좁으면 줄바꿈(`flex-wrap`)하고 12px 간격을 유지합니다.

### 테마 스위치
- iOS 스타일 트랙+원형 노브. 46×26px, 테두리 2px. 텍스트 라벨은 없고 트랙 양 끝에
  해·달 아이콘(1.8px 선, 둥근 끝)을 두어 노브가 가리지 않은 쪽만 흐리게 보입니다.
- 꺼짐(라이트)은 투명 트랙 + `rgba(163,163,163,0.6)` 테두리, 켜짐(다크)은 고정 짙은 회색
  (`#262626`) 채움입니다. 페이지 테마와 무관하게 항상 같은 색이라 The Grey Backdrop Rule을
  벗어나지 않습니다 — 초록 등 새 색을 켜짐 상태에 쓰지 않습니다.
- 노브는 항상 흰 원(18px)이고 아이콘을 담지 않습니다.

### Ghost pill
- 완전 알약, 1px `rgba(163,163,163,0.5)` 테두리, 12px `{colors.ink-muted}` 텍스트, 패딩 4px 12px.
  호버 `rgba(255,255,255,0.4)` 채움, 다크 `rgba(255,255,255,0.1)`. 바깥 링크는 새 탭.

### 목록 카드 (`<article>`)
- 24px 유리 카드, 24px 패딩, Glass lift. 제목 링크는 `::after` 로 카드 전체를 덮어 카드 어디를
  눌러도 이동합니다. 키워드는 `<ul>` 의 칩(알약, 흰색 40%, 12px).

### 포커스
- 2px `{colors.focus-indigo}` 아웃라인, 오프셋 3px. 셸에서 유일한 색입니다.

## Do's and Don'ts

- **Do** 셸에 새 요소를 넣기 전에 "이게 모든 실험 위에 떠야 하는가" 를 묻습니다.
- **Do** 새 UI 를 라이트와 다크 양쪽에서 확인하고, 다크는 `<html class="dark">` 변형(`dark:`)으로 씁니다.
- **Do** 실험 카드의 문장은 `meta.ts` 에서 옵니다. 카드에만 있는 문구를 만들지 않습니다.
- **Don't** 셸에 색·웹폰트·그라디언트를 들이지 않습니다.
- **Don't** 상단 바를 sticky 로 만들거나 높이를 키우지 않습니다. 실험 화면을 가립니다.
- **Don't** 실험 폴더 안의 스타일을 셸 작업에서 바꾸지 않습니다.
