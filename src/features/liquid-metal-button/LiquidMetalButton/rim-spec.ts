/*
 * 링 텍스처(rim-reference.png)의 사양과 조절값 타입. 컴포넌트 파일과 분리해 둔 이유는
 * Fast Refresh 가 "컴포넌트만 export 하는 파일" 에서만 온전히 동작하기 때문입니다.
 */

/** 텍스처의 한 줄(밴드)당 행 수 = 한 주기의 프레임 수. scripts/build_rim_texture.py (이 feature 폴더 안) 출력값. */
export const ROWS_PER_BAND = 198
/** 한 주기의 길이(초). 위와 같은 스크립트가 잰 값. */
export const REFERENCE_PERIOD = 3.3217

/** 사용자가 조절할 수 있는 색 보정. 전부 1 이 "영상 그대로" 입니다 (hue 는 0). */
export interface RimAdjust {
  /** 밝기 배율 */
  brightness: number
  /** 대비 배율 (중간 회색 기준) */
  contrast: number
  /** 채도 배율 — 무지개 프린지의 세기 */
  saturation: number
  /** 색조 회전(도). 무지개를 따뜻하게/차갑게 기울입니다 */
  hue: number
}

export const DEFAULT_ADJUST: RimAdjust = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
  hue: 0,
}
