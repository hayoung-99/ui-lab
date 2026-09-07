/*
 * 사이트 전체의 이름·주소·작성자. 앱(제목, 헤더 링크)과 빌드 후처리(scripts/prerender.ts)가
 * 같은 값을 읽습니다. React 를 import 하지 않는 순수 데이터라 Node 에서도 그대로 읽힙니다.
 */
export const SITE = {
  name: 'UI Lab',
  title: 'UI Lab — Hayoung의 인터랙티브 UI 저장소',
  description:
    'UI 컴포넌트와 페이지를 하나씩 만들어 보고 기록하는 실험실. 각 실험은 브라우저에서 직접 만져 볼 수 있고, 무엇을 어떻게 만들었는지 스펙과 함께 남깁니다.',
  /** 배포 주소. canonical·sitemap 은 로컬에서 빌드해도 늘 이 주소를 가리킵니다. */
  url: 'https://hayoung-99.github.io/ui-lab/',
  repo: 'https://github.com/hayoung-99/ui-lab',
  owner: {
    name: 'hayoung-99',
    displayName: 'Hayoung',
    github: 'https://github.com/hayoung-99',
  },
  locale: 'ko_KR',
  lang: 'ko',
} as const
