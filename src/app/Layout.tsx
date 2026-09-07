import { Suspense } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { FEATURES } from '../features/registry'
import { SITE } from '../site'
import { useTheme } from './theme-context'
import { ghostPill } from './ui'

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.9 14.6A9 9 0 1 1 9.4 3.1a7 7 0 0 0 11.5 11.5Z" />
    </svg>
  )
}

/* iOS 스타일 스위치. 켜짐(다크) 색은 고정 짙은 회색이라 페이지 테마와 무관하게 항상
   같습니다 — DESIGN.md 의 Grey Backdrop Rule 을 지키기 위해 초록 등 새 색을 쓰지 않습니다. */
function ThemeSwitch({ theme, onToggle }: { theme: 'light' | 'dark'; onToggle: () => void }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '라이트 모드로' : '다크 모드로'}
      className={`relative h-[26px] w-[46px] shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-indigo-500 ${
        isDark ? 'border-neutral-800 bg-neutral-800' : 'border-neutral-400/60 bg-transparent'
      }`}
    >
      <span
        className={`pointer-events-none absolute top-1/2 right-[7px] h-3 w-3 -translate-y-1/2 text-neutral-400 transition-opacity ${isDark ? 'opacity-0' : 'opacity-100'}`}
      >
        <SunIcon />
      </span>
      <span
        className={`pointer-events-none absolute top-1/2 left-[7px] h-3 w-3 -translate-y-1/2 text-white/60 transition-opacity ${isDark ? 'opacity-100' : 'opacity-0'}`}
      >
        <MoonIcon />
      </span>
      <span
        className={`absolute top-[2px] left-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-transform ${
          isDark ? 'translate-x-[20px]' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export function Layout() {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const activeFeature = FEATURES.find((f) => location.pathname === `/${f.slug}/`)
  const githubHref = activeFeature ? `${SITE.repo}/tree/main/src/features/${activeFeature.slug}` : SITE.repo
  const githubLabel = activeFeature ? activeFeature.title : 'ui-lab'

  return (
    <div className="min-h-screen bg-[#d3d3d5] px-6 py-10 transition-colors sm:px-8 dark:bg-[#151517]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8">
        <header className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {activeFeature ? (
            <Link to="/" className={`h-[26px] w-fit ${ghostPill}`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              목록으로
            </Link>
          ) : (
            <Link
              to="/"
              className="text-sm font-semibold tracking-wide text-neutral-800 hover:text-neutral-950 dark:text-neutral-100 dark:hover:text-white"
            >
              {SITE.name}
            </Link>
          )}

          <nav className="ml-auto flex flex-wrap items-center gap-3" aria-label="바깥 링크와 테마">
            <a href={githubHref} target="_blank" rel="noopener noreferrer" className={`h-[26px] ${ghostPill}`}>
              <GitHubIcon />
              {githubLabel}
            </a>
            <ThemeSwitch theme={theme} onToggle={toggle} />
          </nav>
        </header>

        {/* lazy 페이지가 내려오는 동안은 빈 자리. 배경은 이미 그려져 있어 깜빡임이 크지 않습니다 */}
        <Suspense fallback={<div className="min-h-[380px]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
