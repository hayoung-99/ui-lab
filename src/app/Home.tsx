import { Link } from 'react-router'
import { FEATURES } from '../features/registry'
import { SITE } from '../site'
import { glassCard, sectionLabel } from './ui'
import { useSeo } from './useSeo'

export function Home() {
  useSeo({ title: SITE.title, description: SITE.description, path: '' })

  return (
    <main className="flex flex-col gap-8">
      <header className="max-w-[640px]">
        <p className={sectionLabel}>{SITE.owner.displayName} 의 인터랙티브 UI 저장소</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-800 dark:text-neutral-100">{SITE.name}</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">{SITE.description}</p>
      </header>

      <section aria-label="실험 목록" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <article key={f.slug} className={`flex flex-col gap-3 ${glassCard}`}>
            <time dateTime={f.createdAt} className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              {f.createdAt}
            </time>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              <Link to={`/${f.slug}/`} className="after:absolute after:inset-0 hover:underline">
                {f.title}
              </Link>
            </h2>
            <p className="text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">{f.summary}</p>
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="키워드">
              {f.keywords.map((k) => (
                <li
                  key={k}
                  className="rounded-full border border-black/10 bg-white/40 px-2.5 py-1 text-[12px] leading-none text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-300"
                >
                  {k}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  )
}
