import { Suspense } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
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

export function Layout() {
  const { theme, toggle } = useTheme()
  const isHome = useLocation().pathname === '/'

  return (
    <div className="min-h-screen bg-[#d3d3d5] px-6 py-10 transition-colors sm:px-8 dark:bg-[#151517]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <Link
            to="/"
            className="text-sm font-semibold tracking-wide text-neutral-800 hover:text-neutral-950 dark:text-neutral-100 dark:hover:text-white"
          >
            {SITE.name}
          </Link>

          <nav className="flex flex-wrap items-center gap-2" aria-label="바깥 링크와 테마">
            {isHome && (
              <>
                <a href={SITE.owner.github} target="_blank" rel="noopener noreferrer" className={ghostPill}>
                  <GitHubIcon />
                  {SITE.owner.name}
                </a>
                <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className={ghostPill}>
                  <GitHubIcon />
                  ui-lab
                </a>
              </>
            )}
            <button type="button" onClick={toggle} className={ghostPill}>
              {theme === 'dark' ? '라이트 모드로' : '다크 모드로'}
            </button>
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
