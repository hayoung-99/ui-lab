/*
 * feature 하나를 설명하는 데이터. 각 feature 폴더의 meta.ts 가 이 모양의 객체를 export 합니다.
 * URL 조각(slug)은 폴더 이름에서 오므로 여기 적지 않습니다.
 *
 * meta.ts 는 React 를 import 하지 않는 순수 데이터여야 합니다 — 빌드 후처리
 * (scripts/prerender.ts)가 Node 에서 그대로 읽어 검색 엔진용 HTML 을 만들기 때문입니다.
 */
export interface FeatureMeta {
  /** 화면과 <title> 에 쓰는 이름. 'Liquid Metal Button' */
  title: string
  /** 목록 카드의 한 줄 */
  summary: string
  /**
   * 검색·답변 엔진용 1~2문장. "무엇을 · 어떻게 · 무엇으로" 가 한 문장 안에 있게 씁니다.
   * 답변 엔진은 이 문장을 그대로 인용합니다.
   */
  description: string
  /** 검색 키워드이자 목록 카드의 칩 */
  keywords: string[]
  /** 구현에 쓴 언어. 구조화 데이터(JSON-LD)의 programmingLanguage */
  programmingLanguage: string[]
  /** 'YYYY-MM-DD' */
  createdAt: string
  /** 'YYYY-MM-DD'. sitemap 의 lastmod */
  updatedAt: string
}
