import {
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { MetalRim } from './MetalRim'
import { DEFAULT_ADJUST, type RimAdjust } from './rim-spec'
import './liquid-metal-button.css'

export type LiquidMetalTheme = 'light' | 'dark'
export type { RimAdjust }
export { DEFAULT_ADJUST }

interface LiquidMetalButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: ReactNode
  className?: string
  /** 비우면 시스템 설정(prefers-color-scheme)을 따릅니다. */
  theme?: LiquidMetalTheme
  /** 링 두께(px). 기본 7. */
  ring?: number
  /** 재생 속도. 1 이 레퍼런스 영상과 같은 속도(한 주기 3.32초), 0 정지, 음수 역방향. */
  rate?: number
  /** 색 보정. 빠진 항목은 "영상 그대로" 값을 씁니다. */
  adjust?: Partial<RimAdjust>
}

/** 캔버스가 버튼 박스보다 사방으로 넓은 여유(px). */
const MARGIN = 6

function hasWebGL(): boolean {
  const c = document.createElement('canvas')
  return !!c.getContext('webgl2')
}

/** 미디어 쿼리 하나를 boolean 상태로. 바뀌면 따라갑니다. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export function LiquidMetalButton({
  children,
  className = '',
  type = 'button',
  theme,
  ring = 7,
  rate = 1,
  adjust,
  ...props
}: LiquidMetalButtonProps) {
  const [webgl] = useState(hasWebGL)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)')
  const dark = theme ? theme === 'dark' : systemDark

  // hover 와 무관하게 늘 같은 흐름. 속도 변화까지 영상에 들어 있습니다.
  const effectiveRate = reduced ? 0 : rate
  const fullAdjust = useMemo(
    () => ({ ...DEFAULT_ADJUST, ...adjust }),
    [adjust],
  )

  return (
    <button
      type={type}
      className={`liquid-metal-button font-sans text-[22px] font-medium ${className}`}
      data-theme={dark ? 'dark' : 'light'}
      style={{ '--ring': `${ring}px` } as React.CSSProperties}
      {...props}
    >
      {webgl && (
        <span
          className="liquid-metal-button__rim"
          // 절대 배치의 기준은 패딩 박스라, 테두리 자리까지 덮으려면 ring 만큼 더 나가야 합니다
          style={{ inset: `${-(MARGIN + ring)}px` }}
          aria-hidden="true"
        >
          <MetalRim
            ring={ring}
            margin={MARGIN}
            rate={effectiveRate}
            dark={dark}
            adjust={fullAdjust}
          />
        </span>
      )}
      <span className="liquid-metal-button__label">{children}</span>
    </button>
  )
}
