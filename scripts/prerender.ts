/*
 * 빌드 후처리. `vite build` 가 만든 dist/index.html 을 틀로 삼아, route 마다 검색·답변
 * 엔진이 읽을 수 있는 정적 HTML 을 씁니다. GitHub Pages 는 서버 렌더링이 없으므로
 * 이것이 각 페이지가 "자바스크립트 없이도 글이 있는 200 응답" 이 되는 유일한 길입니다.
 *
 *   dist/index.html                  목록 — feature 링크를 정적 <a> 로
 *   dist/<slug>/index.html           feature — 제목·설명·키워드·JSON-LD
 *   dist/404.html                    없는 경로 (noindex)
 *   dist/sitemap.xml, robots.txt, llms.txt
 *
 * React 컴포넌트는 돌리지 않습니다 (WebGL 컴포넌트가 window 를 초기화 시점에 씁니다).
 * 정적 본문은 각 feature 의 meta.ts 만으로 만들고, JS 가 뜨면 React 가 갈아 끼웁니다.
 *
 * 실행: node scripts/prerender.ts  (Node 22.18+ 는 .ts 를 바로 실행합니다)
 */
import { globSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { FeatureMeta } from '../src/features/types.ts'
import { SITE } from '../src/site.ts'

const ROOT = resolve(import.meta.dirname, '..')
const DIST = resolve(ROOT, 'dist')
/** 자산 경로의 base. 템플릿에는 이미 반영돼 있고, 정적 본문의 내부 링크에만 씁니다. */
const BASE = process.env.BASE_PATH ?? '/'
/** canonical·sitemap 은 어디서 빌드하든 배포 주소를 가리킵니다. */
const SITE_URL = SITE.url
const OG_IMAGE = `${SITE_URL}og.png`

interface Feature extends FeatureMeta {
  slug: string
}

async function loadFeatures(): Promise<Feature[]> {
  const files = globSync('src/features/*/meta.ts', { cwd: ROOT }).sort()
  const features: Feature[] = []
  for (const file of files) {
    const mod = (await import(pathToFileURL(resolve(ROOT, file)).href)) as { meta: FeatureMeta }
    features.push({ ...mod.meta, slug: basename(dirname(file)) })
  }
  return features.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

interface PageSpec {
  /** SITE_URL 기준 경로. '' | 'liquid-metal-button/' */
  path: string
  title: string
  description: string
  jsonLd?: object
  body: string
  noindex?: boolean
  modified?: string
}

function renderPage(template: string, page: PageSpec): string {
  const url = SITE_URL + page.path
  const head = [
    page.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.path ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    page.jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')}</script>`
      : '',
  ]
    .filter(Boolean)
    .join('\n    ')

  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`)
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${esc(page.description)}" />`,
  )
  html = html.replace('</head>', `    ${head}\n  </head>`)
  if (!html.includes('<div id="root"></div>')) throw new Error('템플릿에 <div id="root"></div> 가 없습니다')
  html = html.replace('<div id="root"></div>', `<div id="root">${page.body}</div>`)
  return html
}

/* ── 정적 본문. JS 가 뜨기 전 잠깐 보이고, 크롤러에게는 이것이 페이지의 전부입니다. ── */

const STYLE = {
  main: 'max-width:1180px;margin:0 auto;padding:40px 24px;font-family:ui-sans-serif,system-ui,sans-serif;color:#262626;line-height:1.5',
  label: 'font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#737373;margin:0',
  h1: 'font-size:24px;font-weight:600;margin:4px 0 8px',
  p: 'font-size:13px;color:#404040;max-width:640px;margin:0 0 16px',
  link: 'color:#262626',
  mono: 'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#737373',
} as const

function homeBody(features: Feature[]): string {
  const items = features
    .map(
      (f) => `
      <li style="margin:0 0 16px">
        <time datetime="${f.createdAt}" style="${STYLE.mono}">${f.createdAt}</time>
        <h2 style="font-size:18px;font-weight:600;margin:2px 0 4px"><a href="${BASE}${f.slug}/" style="${STYLE.link}">${esc(f.title)}</a></h2>
        <p style="${STYLE.p}">${esc(f.summary)}</p>
      </li>`,
    )
    .join('')
  return `
    <main style="${STYLE.main}">
      <p style="${STYLE.label}">${esc(SITE.owner.displayName)} 의 인터랙티브 UI 저장소</p>
      <h1 style="${STYLE.h1}">${esc(SITE.name)}</h1>
      <p style="${STYLE.p}">${esc(SITE.description)}</p>
      <ul style="list-style:none;padding:0;margin:24px 0 0">${items}
      </ul>
      <p style="${STYLE.mono}"><a href="${SITE.repo}" style="${STYLE.link}">GitHub</a></p>
    </main>`
}

function featureBody(f: Feature): string {
  return `
    <main style="${STYLE.main}">
      <p style="${STYLE.label}"><a href="${BASE}" style="color:inherit;text-decoration:none">${esc(SITE.name)}</a></p>
      <h1 style="${STYLE.h1}">${esc(f.title)}</h1>
      <p style="${STYLE.mono}"><time datetime="${f.createdAt}">${f.createdAt}</time> · ${esc(f.keywords.join(' · '))}</p>
      <p style="${STYLE.p}">${esc(f.description)}</p>
      <p style="${STYLE.mono}"><a href="${SITE.repo}/tree/main/src/features/${f.slug}" style="${STYLE.link}">소스 보기</a> · <a href="${BASE}" style="${STYLE.link}">목록으로</a></p>
    </main>`
}

/* ── 구조화 데이터 ───────────────────────────────────────────────────────── */

const personId = `${SITE.owner.github}#person`
const websiteId = `${SITE_URL}#website`

const person = {
  '@type': 'Person',
  '@id': personId,
  name: SITE.owner.name,
  url: SITE.owner.github,
}

const website = {
  '@type': 'WebSite',
  '@id': websiteId,
  url: SITE_URL,
  name: SITE.name,
  description: SITE.description,
  inLanguage: SITE.lang,
  author: { '@id': personId },
}

function featureWork(f: Feature) {
  return {
    '@type': 'SoftwareSourceCode',
    '@id': `${SITE_URL}${f.slug}/#work`,
    url: `${SITE_URL}${f.slug}/`,
    name: f.title,
    headline: f.title,
    description: f.description,
    keywords: f.keywords.join(', '),
    programmingLanguage: f.programmingLanguage,
    runtimePlatform: 'Web browser',
    codeRepository: `${SITE.repo}/tree/main/src/features/${f.slug}`,
    dateCreated: f.createdAt,
    dateModified: f.updatedAt,
    inLanguage: SITE.lang,
    author: { '@id': personId },
    isPartOf: { '@id': websiteId },
  }
}

function homeJsonLd(features: Feature[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      person,
      {
        '@type': 'CollectionPage',
        url: SITE_URL,
        name: SITE.title,
        description: SITE.description,
        inLanguage: SITE.lang,
        isPartOf: { '@id': websiteId },
        hasPart: features.map((f) => ({ '@id': `${SITE_URL}${f.slug}/#work` })),
      },
      ...features.map(featureWork),
    ],
  }
}

function featureJsonLd(f: Feature) {
  return { '@context': 'https://schema.org', '@graph': [website, person, featureWork(f)] }
}

/* ── 부속 파일 ──────────────────────────────────────────────────────────── */

function sitemap(features: Feature[], today: string): string {
  const urls = [
    { loc: SITE_URL, lastmod: features[0]?.updatedAt ?? today },
    ...features.map((f) => ({ loc: `${SITE_URL}${f.slug}/`, lastmod: f.updatedAt })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
}

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}sitemap.xml
`

function llmsTxt(features: Feature[]): string {
  return `# ${SITE.name}

> ${SITE.description}

만든 사람: ${SITE.owner.name} (${SITE.owner.github}). 소스: ${SITE.repo}

## 실험 목록

${features.map((f) => `- [${f.title}](${SITE_URL}${f.slug}/): ${f.description}`).join('\n')}
`
}

/* ── 실행 ───────────────────────────────────────────────────────────────── */

const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')
const features = await loadFeatures()
const today = new Date().toISOString().slice(0, 10)

writeFileSync(
  resolve(DIST, 'index.html'),
  renderPage(template, {
    path: '',
    title: SITE.title,
    description: SITE.description,
    jsonLd: homeJsonLd(features),
    body: homeBody(features),
  }),
)

for (const f of features) {
  mkdirSync(resolve(DIST, f.slug), { recursive: true })
  writeFileSync(
    resolve(DIST, f.slug, 'index.html'),
    renderPage(template, {
      path: `${f.slug}/`,
      title: `${f.title} — ${SITE.name}`,
      description: f.description,
      jsonLd: featureJsonLd(f),
      body: featureBody(f),
    }),
  )
}

writeFileSync(
  resolve(DIST, '404.html'),
  renderPage(template, {
    path: '',
    title: `페이지를 찾을 수 없습니다 — ${SITE.name}`,
    description: '없는 주소입니다.',
    noindex: true,
    body: `<main style="${STYLE.main}"><h1 style="${STYLE.h1}">이 주소에는 실험이 없습니다</h1><p style="${STYLE.p}"><a href="${BASE}" style="${STYLE.link}">목록으로</a></p></main>`,
  }),
)

writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap(features, today))
writeFileSync(resolve(DIST, 'robots.txt'), robots)
writeFileSync(resolve(DIST, 'llms.txt'), llmsTxt(features))

console.log(`prerender: ${features.length + 2} pages (${features.map((f) => f.slug).join(', ')}), sitemap, robots, llms.txt`)
