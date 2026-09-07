import { useState } from 'react'
import { useTheme } from '../../app/theme-context'
import { useSeo } from '../../app/useSeo'
import {
  DEFAULT_ADJUST,
  LiquidMetalButton,
  type RimAdjust,
} from './LiquidMetalButton/LiquidMetalButton'
import { REFERENCE_PERIOD } from './LiquidMetalButton/rim-spec'
import { meta } from './meta'

/* ── 공통 카드 ───────────────────────────────────────────────────────────── */

const cardClass =
  'rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_1px_0_rgba(255,255,255,0.7),0_20px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)]'

/* ── 스펙 키워드 ───────────────────────────────────────────────────────── */

type Keyword = string | { code: string }

/* 구현 사실을 키워드로 줄인 것. 새 주장은 넣지 않습니다. */
const KEYWORDS: { group: string; items: Keyword[] }[] = [
  {
    group: 'Rendering',
    items: ['WebGL2', 'GLSL ES 3.0', '512 × 8 띠', { code: 'SRGB8_ALPHA8' }, 'MSAA', 'draw call 1'],
  },
  {
    group: 'Data',
    items: ['750×220 · 60fps', '640 프레임', { code: 'rim-reference.png' }, '512×594 · 164KB', `${REFERENCE_PERIOD.toFixed(2)}s 주기`],
  },
  {
    group: 'Behavior',
    items: ['다크모드 밝기 반전', { code: 'ring · rate · adjust' }, { code: 'prefers-reduced-motion' }, 'conic-gradient 폴백'],
  },
  {
    group: 'Stack',
    items: ['React 19.2', 'TypeScript 6', 'Vite 8', 'Tailwind CSS 4', '페이지 청크 14KB · gzip 6KB', { code: 'frames.swift' }, { code: 'build_rim_texture.py' }],
  },
]

function Chip({ item }: { item: Keyword }) {
  const code = typeof item !== 'string'
  const text = code ? item.code : item
  return (
    <span
      className={`rounded-full border border-black/10 bg-white/40 px-2.5 py-1 text-[12px] leading-none text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-300 ${code ? 'font-mono' : ''}`}
    >
      {text}
    </span>
  )
}

function SpecKeywords() {
  return (
    <section className={`min-w-0 flex-1 ${cardClass}`}>
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Tech Spec</h2>
        <span className="text-[11px] font-semibold tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
          키워드
        </span>
      </header>
      <dl className="space-y-3">
        {KEYWORDS.map(({ group, items }) => (
          <div key={group} className="grid grid-cols-[92px_1fr] items-baseline gap-3">
            <dt className="pt-1 text-[11px] font-semibold tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
              {group}
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <Chip key={typeof item === 'string' ? item : item.code} item={item} />
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ── 조절 패널 ────────────────────────────────────────────────────────────── */

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  defaultValue: number
  onChange: (v: number) => void
}

function Slider({ label, value, min, max, step, unit = '', defaultValue, onChange }: SliderProps) {
  const changed = value !== defaultValue
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between text-[13px]">
        <span className="text-neutral-700 dark:text-neutral-300">{label}</span>
        <span className={`font-mono text-[12px] tabular-nums ${changed ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400'}`}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={() => onChange(defaultValue)}
        title="더블클릭하면 기본값"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-neutral-800 dark:bg-white/15 dark:accent-neutral-200"
      />
      <div className="mt-0.5 flex justify-between font-mono text-[10px] text-neutral-400">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </label>
  )
}

interface Controls {
  ring: number
  rate: number
  adjust: RimAdjust
}

const DEFAULT_CONTROLS: Controls = { ring: 7, rate: 1, adjust: DEFAULT_ADJUST }

function ControlPanel({
  value,
  onChange,
}: {
  value: Controls
  onChange: (next: Controls) => void
}) {
  const setAdjust = (patch: Partial<RimAdjust>) =>
    onChange({ ...value, adjust: { ...value.adjust, ...patch } })
  const isDefault = JSON.stringify(value) === JSON.stringify(DEFAULT_CONTROLS)

  return (
    <section className={`w-[360px] ${cardClass}`}>
      <header className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
            Controls
          </p>
          <p className="mt-0.5 text-[12px] text-neutral-500 dark:text-neutral-400">
            슬라이더를 더블클릭하면 그 값만 기본으로
          </p>
        </div>
        <button
          type="button"
          disabled={isDefault}
          onClick={() => onChange(DEFAULT_CONTROLS)}
          className="rounded-full border border-neutral-400/50 px-2.5 py-0.5 text-[11px] text-neutral-600 hover:bg-white/40 disabled:cursor-default disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-white/10"
        >
          초기화
        </button>
      </header>

      <div className="space-y-4">
        <Slider label="링 두께" value={value.ring} min={2} max={14} step={1} unit="px" defaultValue={7} onChange={(ring) => onChange({ ...value, ring })} />
        <Slider label="재생 속도" value={value.rate} min={-2} max={2} step={0.05} unit="×" defaultValue={1} onChange={(rate) => onChange({ ...value, rate })} />
        <Slider label="밝기" value={value.adjust.brightness} min={0.5} max={1.5} step={0.01} defaultValue={1} onChange={(brightness) => setAdjust({ brightness })} />
        <Slider label="대비" value={value.adjust.contrast} min={0.5} max={1.5} step={0.01} defaultValue={1} onChange={(contrast) => setAdjust({ contrast })} />
        <Slider label="채도 (무지개 세기)" value={value.adjust.saturation} min={0} max={2} step={0.01} defaultValue={1} onChange={(saturation) => setAdjust({ saturation })} />
        <Slider label="색조 회전" value={value.adjust.hue} min={-180} max={180} step={1} unit="°" defaultValue={0} onChange={(hue) => setAdjust({ hue })} />
      </div>
    </section>
  )
}

/* ── 쇼케이스 ─────────────────────────────────────────────────────────────── */

export default function Page() {
  const { theme } = useTheme()
  const [controls, setControls] = useState<Controls>(DEFAULT_CONTROLS)
  useSeo({ title: `${meta.title} — UI Lab`, description: meta.description, path: 'liquid-metal-button/' })

  return (
    <main className="flex flex-col gap-8">
      {/* 제목줄 — 테마 토글은 셸(Layout)로 올라갔습니다 */}
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">{meta.title}</h1>
        <time dateTime={meta.createdAt} className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          {meta.createdAt}
        </time>
      </header>

      {/* 무대 + 조절: 버튼이 주인공, 컨트롤은 옆에서 */}
      <section className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
        <div className="flex min-h-[380px] flex-1 items-center justify-center rounded-[64px] border border-white/50 bg-[#dcdcde] bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(255,255,255,0.45),transparent)] p-12 shadow-[inset_0_2px_10px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.6)] transition-colors lg:min-h-[460px] dark:border-white/5 dark:bg-[#1d1d21] dark:bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(255,255,255,0.05),transparent)] dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <LiquidMetalButton
            theme={theme}
            ring={controls.ring}
            rate={controls.rate}
            adjust={controls.adjust}
          >
            Elements
          </LiquidMetalButton>
        </div>

        <ControlPanel value={controls} onChange={setControls} />
      </section>

      {/* 스펙 키워드 */}
      <SpecKeywords />
    </main>
  )
}
