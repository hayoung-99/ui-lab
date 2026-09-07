import { useEffect } from 'react'
import { SITE } from '../site'

interface SeoInput {
  title: string
  description: string
  /** 사이트 루트 기준 경로. '' 는 목록, 'liquid-metal-button/' 은 feature */
  path: string
}

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector<HTMLElement>(selector)
  if (el) el.setAttribute(attr, value)
}

/*
 * 클라이언트 라우팅으로 페이지가 바뀔 때 <head> 의 제목·설명·canonical·OG 를 맞춥니다.
 * 태그 자체는 index.html 과 prerender 가 이미 넣어 두므로 여기서는 값만 갈아 끼웁니다 —
 * 새로 만들면 정적 HTML 의 것과 겹쳐 두 개가 됩니다.
 */
export function useSeo({ title, description, path }: SeoInput) {
  useEffect(() => {
    const url = SITE.url + path
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
  }, [title, description, path])
}
