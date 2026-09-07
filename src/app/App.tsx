import { Link, Route, Routes } from 'react-router'
import { FEATURES } from '../features/registry'
import { Home } from './Home'
import { Layout } from './Layout'
import { ThemeProvider } from './ThemeProvider'
import { ghostPill } from './ui'
import { useSeo } from './useSeo'

function NotFound() {
  useSeo({ title: '페이지를 찾을 수 없습니다 — UI Lab', description: '없는 주소입니다.', path: '' })
  return (
    <main className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400">404</p>
      <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">이 주소에는 실험이 없습니다</h1>
      <Link to="/" className={ghostPill}>
        목록으로
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          {FEATURES.map((f) => (
            <Route key={f.slug} path={f.slug} element={<f.Page />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
