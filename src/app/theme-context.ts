import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeValue {
  theme: Theme
  toggle: () => void
}

export const ThemeContext = createContext<ThemeValue | null>(null)

/** 셸(Layout)이 제공하는 라이트·다크 상태. 페이지는 이것을 읽어 컴포넌트에 넘깁니다. */
export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme 은 ThemeProvider 안에서만 쓸 수 있습니다')
  return value
}
