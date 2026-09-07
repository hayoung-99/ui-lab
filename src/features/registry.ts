import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { FeatureMeta } from './types'

/*
 * features/ 아래 폴더를 자동으로 모읍니다. 새 feature 를 추가할 때 여기를 고칠 필요는
 * 없고, 폴더 안에 meta.ts 와 Page.tsx 만 두면 됩니다. URL 조각은 폴더 이름입니다.
 *
 * Page 는 lazy 로 걸어, 목록 페이지를 열 때 각 feature 의 코드와 자산이 함께 내려오지
 * 않게 합니다.
 */

export interface Feature extends FeatureMeta {
  slug: string
  Page: LazyExoticComponent<ComponentType>
}

const metas = import.meta.glob<{ meta: FeatureMeta }>('./*/meta.ts', { eager: true })
const pages = import.meta.glob<{ default: ComponentType }>('./*/Page.tsx')

export const FEATURES: Feature[] = Object.entries(metas)
  .map(([path, mod]) => {
    const dir = path.replace(/\/meta\.ts$/, '')
    const load = pages[`${dir}/Page.tsx`]
    if (!load) throw new Error(`${dir} 에 Page.tsx 가 없습니다`)
    return { ...mod.meta, slug: dir.replace(/^\.\//, ''), Page: lazy(load) }
  })
  // 최근 것이 앞에
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
