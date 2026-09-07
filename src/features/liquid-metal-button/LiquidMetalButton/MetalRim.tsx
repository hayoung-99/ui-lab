import { useEffect, useRef } from 'react'
import rimReferenceUrl from './rim-reference.png'
import { REFERENCE_PERIOD, ROWS_PER_BAND, type RimAdjust } from './rim-spec'

/*
 * 버튼 테두리 자리에 얹히는 링. 레퍼런스 영상을 그대로 재생합니다.
 *
 * 영상을 1/60초 간격으로 스냅샷 찍어 각 프레임에서 링 둘레의 색을 세 줄(안쪽·중간·
 * 바깥)로 뽑아 "둘레 × 시간" 텍스처(rim-reference.png)로 구워 두었습니다. 링은 그
 * 텍스처를 시간축으로 훑을 뿐이라 반사·무지개·속도 변화가 전부 영상과 같습니다.
 * 프레임 사이는 보간하고, 한 주기(영상과 가장 닮은 프레임으로 찾은 3.32초)가 끝나면
 * 첫 프레임으로 이어집니다. 텍스처는 이 feature 폴더의 scripts/build_rim_texture.py 로 만듭니다.
 *
 * 순수 WebGL2 입니다. 조명·재질이 없어 three.js 가 할 일이 "곡선을 따라 텍스처 입히기"
 * 하나뿐이었기 때문에 걷어냈습니다 (그 판은 저장소 루트 archive/MetalRim.three.tsx 에 있습니다).
 *
 * 텍스처 배치: 가로 = 둘레 위치(왼쪽 위 모서리에서 시계 방향, 지오메트리의 uv.x 와 동일),
 * 세로 = [안쪽 줄 T행][중간 줄 T행][바깥 줄 T행].
 */

interface MetalRimProps {
  /** 링 두께(px). */
  ring: number
  /** 캔버스가 버튼 박스보다 사방으로 얼마나 큰지(px). */
  margin: number
  /** 재생 속도. 1 이 영상과 같은 속도, 0 이면 정지, 음수면 역방향. */
  rate: number
  /** 다크모드. 밝기만 뒤집어 흰↔검이 바뀌고 무지개 색은 남습니다. */
  dark: boolean
  adjust: RimAdjust
}

/** 알약 둘레 위의 점. t 는 0..1, 왼쪽 위 모서리에서 시작해 시계 방향. 단위는 px, y 는 위가 +. */
function stadiumPoint(t: number, w: number, h: number): [number, number] {
  const r = h / 2
  const L = w - h
  const P = 2 * L + 2 * Math.PI * r
  let s = t * P
  if (s < L) return [-L / 2 + s, r]
  s -= L
  if (s < Math.PI * r) {
    const a = Math.PI / 2 - s / r
    return [L / 2 + r * Math.cos(a), r * Math.sin(a)]
  }
  s -= Math.PI * r
  if (s < L) return [L / 2 - s, -r]
  s -= L
  const a = -Math.PI / 2 - s / r
  return [-L / 2 + r * Math.cos(a), r * Math.sin(a)]
}

/**
 * 알약 둘레를 따라 폭 ring 의 평평한 띠. 정점마다 (x, y, u, v) — u 는 둘레 위치,
 * v 는 폭 방향(0 안쪽 → 1 바깥). 색은 텍스처에서 오므로 입체 단면은 필요 없습니다.
 */
function buildRim(w: number, h: number, ring: number) {
  const along = 512
  const across = 8
  const verts = new Float32Array((along + 1) * (across + 1) * 4)
  let k = 0
  for (let i = 0; i <= along; i++) {
    const t = (i % along) / along
    const [px, py] = stadiumPoint(t, w, h)
    // 접선을 유한차분으로 구해 반시계로 90° 돌리면 바깥쪽 법선 (시계 방향 곡선이므로)
    const [ax, ay] = stadiumPoint((t + 1e-4) % 1, w, h)
    const [bx, by] = stadiumPoint((t - 1e-4 + 1) % 1, w, h)
    let tx = ax - bx
    let ty = ay - by
    const len = Math.hypot(tx, ty) || 1
    tx /= len
    ty /= len
    const nx = -ty
    const ny = tx
    for (let j = 0; j <= across; j++) {
      const u = j / across
      const off = (u - 0.5) * ring
      verts[k++] = px + nx * off
      verts[k++] = py + ny * off
      verts[k++] = i / along
      verts[k++] = u
    }
  }
  const row = across + 1
  const index = new Uint16Array(along * across * 6)
  let m = 0
  for (let i = 0; i < along; i++) {
    for (let j = 0; j < across; j++) {
      const a = i * row + j
      const b = a + row
      index[m++] = a
      index[m++] = a + 1
      index[m++] = b
      index[m++] = a + 1
      index[m++] = b + 1
      index[m++] = b
    }
  }
  return { verts, index }
}

const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
in vec2 aUv;
uniform vec2 uHalf;   // 캔버스 절반 크기(px). px 좌표를 클립 공간으로
out vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPos / uHalf, 0.0, 1.0);
}
`

/*
 * 시간 t(0..1)에 해당하는 행을 두 개 골라 직접 섞습니다. 텍스처의 세로 방향 선형
 * 필터에 맡기면 밴드 경계에서 다음 밴드의 첫 행이 섞여 들어오기 때문입니다.
 * 폭 방향은 안쪽·중간·바깥 세 줄 사이를 v 로 섞습니다.
 *
 * 텍스처는 SRGB8_ALPHA8 로 올려서 샘플 값이 선형이고(보간이 선형 공간에서 되도록),
 * 그 뒤의 색 보정·다크 반전은 전부 sRGB(지각) 공간에서 합니다.
 */
const FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform float uTime;   // 주기 단위 (1 = 한 바퀴)
uniform float uRows;   // 밴드당 행 수
uniform float uInvert; // 0 = 라이트, 1 = 다크
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uHue;    // 라디안
in vec2 vUv;
out vec4 outColor;

vec3 sampleBand(float band, float t) {
  float row = t * uRows;
  float r0 = floor(row);
  float fr = row - r0;
  float r1 = mod(r0 + 1.0, uRows);
  float total = uRows * 3.0;
  vec3 a = texture(uTex, vec2(vUv.x, (band * uRows + r0 + 0.5) / total)).rgb;
  vec3 b = texture(uTex, vec2(vUv.x, (band * uRows + r1 + 0.5) / total)).rgb;
  return mix(a, b, fr);
}

vec3 linearToSRGB(vec3 c) {
  vec3 lo = c * 12.92;
  vec3 hi = pow(c, vec3(1.0 / 2.4)) * 1.055 - 0.055;
  return mix(hi, lo, vec3(lessThanEqual(c, vec3(0.0031308))));
}

const vec3 LUMA = vec3(0.299, 0.587, 0.114);

/* YIQ 에서 색차 평면만 돌려 색조를 회전합니다. 밝기는 그대로. */
vec3 hueRotate(vec3 c, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * c;
  float h = atan(yiq.z, yiq.y) + a;
  float ch = length(yiq.yz);
  yiq.y = ch * cos(h);
  yiq.z = ch * sin(h);
  return toRGB * yiq;
}

/*
 * 다크모드: 밝기(L)만 1-L 로 뒤집고 색차는 그대로 둡니다. 색까지 반전하면 무지개가
 * 보색으로 바뀌어 버립니다. sRGB 공간에서 해야 은색이 어두운 차콜이 됩니다.
 */
vec3 invertLightness(vec3 s) {
  float l = dot(s, LUMA);
  vec3 chroma = s - l;
  return clamp((1.0 - l) + chroma * 1.2, 0.0, 1.0);
}

void main() {
  float t = fract(uTime);
  float pos = clamp(vUv.y, 0.0, 1.0) * 2.0;   // 0 안쪽 … 2 바깥
  float b0 = floor(min(pos, 1.999));
  float f = pos - b0;
  vec3 s = linearToSRGB(mix(sampleBand(b0, t), sampleBand(b0 + 1.0, t), f));

  // 색 보정: 대비 → 밝기 → 채도 → 색조. 전부 기본값이면 그대로 통과합니다.
  s = (s - 0.5) * uContrast + 0.5;
  s *= uBrightness;
  float l = dot(s, LUMA);
  s = l + (s - l) * uSaturation;
  if (uHue != 0.0) s = hueRotate(s, uHue);
  s = clamp(s, 0.0, 1.0);

  s = mix(s, invertLightness(s), uInvert);
  outColor = vec4(s, 1.0);
}
`

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh)
    gl.deleteShader(sh)
    throw new Error(`MetalRim shader: ${log}`)
  }
  return sh
}

export function MetalRim({ ring, margin, rate, dark, adjust }: MetalRimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // 렌더 루프가 매 프레임 읽는 값. 리렌더 없이 갱신되도록 ref 에 둡니다.
  const rateRef = useRef(rate)
  const darkRef = useRef(dark)
  const adjustRef = useRef(adjust)
  const ringRef = useRef(ring)
  const marginRef = useRef(margin)
  // GL 쪽 함수를 바깥 effect 에서 부르기 위한 손잡이
  const wakeRef = useRef<(() => void) | null>(null)
  const rebuildRef = useRef<(() => void) | null>(null)

  // WebGL 컨텍스트·셰이더·텍스처는 한 번만 만듭니다. 링 두께가 바뀌면 지오메트리만 다시.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    })
    if (!gl) return // WebGL2 가 없으면 캔버스를 비워 두고 CSS 크롬 링이 보이게 둡니다

    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`MetalRim program: ${gl.getProgramInfoLog(program)}`)
    }
    gl.useProgram(program)
    const u = (name: string) => gl.getUniformLocation(program, name)
    const uHalf = u('uHalf')
    const uTime = u('uTime')
    const uInvert = u('uInvert')
    const uBrightness = u('uBrightness')
    const uContrast = u('uContrast')
    const uSaturation = u('uSaturation')
    const uHue = u('uHue')
    gl.uniform1f(u('uRows'), ROWS_PER_BAND)
    gl.uniform1i(u('uTex'), 0)

    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)
    const vbo = gl.createBuffer()!
    const ibo = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    const aPos = gl.getAttribLocation(program, 'aPos')
    const aUv = gl.getAttribLocation(program, 'aUv')
    gl.enableVertexAttribArray(aPos)
    gl.enableVertexAttribArray(aUv)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0)
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 16, 8)

    let textureReady = false
    let indexCount = 0
    let time = 0
    const draw = () => {
      if (!textureReady || indexCount === 0) return
      const a = adjustRef.current
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(uTime, time)
      gl.uniform1f(uInvert, darkRef.current ? 1 : 0)
      gl.uniform1f(uBrightness, a.brightness)
      gl.uniform1f(uContrast, a.contrast)
      gl.uniform1f(uSaturation, a.saturation)
      gl.uniform1f(uHue, (a.hue * Math.PI) / 180)
      gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0)
    }

    // 루프: rate 가 0 이면 한 장만 그리고 멈춥니다. 탭이 숨겨지면 rAF 가 알아서 쉽니다.
    let raf = 0
    let last = 0
    const tick = (now: number) => {
      raf = 0
      const dt = last ? (now - last) / 1000 : 0
      last = now
      time += (dt / REFERENCE_PERIOD) * rateRef.current
      draw()
      if (rateRef.current !== 0) raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }
    wakeRef.current = wake
    wake()

    // 텍스처: sRGB 로 올려 샘플이 선형이 되게. 세로 필터는 셰이더가 직접 하므로 밉맵 없음.
    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    const img = new Image()
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, img)
      textureReady = true
      wake()
    }
    img.src = rimReferenceUrl

    // 캔버스 크기에서 버튼 박스를 역산해 띠를 만듭니다 (캔버스 = 버튼 + 사방 margin).
    const rebuild = () => {
      const rect = canvas.getBoundingClientRect()
      const cssW = rect.width
      const cssH = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uHalf, cssW / 2, cssH / 2)
      const ring = ringRef.current
      const margin = marginRef.current
      const { verts, index } = buildRim(cssW - 2 * margin - ring, cssH - 2 * margin - ring, ring)
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW)
      indexCount = index.length
      wake()
    }
    rebuildRef.current = rebuild
    const ro = new ResizeObserver(rebuild)
    ro.observe(canvas)
    // 관찰자 콜백은 렌더 기회가 있어야 오므로(백그라운드 탭에선 안 옴) 처음 한 번은 직접 잽니다
    rebuild()

    // 개발 중 검사용: 백그라운드 탭에서는 rAF 가 멈춰서, 바깥에서 시간을 밀어 넣고
    // 한 장씩 그려 볼 수 있게 창에 걸어 둡니다. 프로덕션 빌드에는 들어가지 않습니다.
    const w = window as unknown as { __liquidMetalDebug?: (cycle: number) => void }
    if (import.meta.env.DEV) {
      w.__liquidMetalDebug = (cycle: number) => {
        time = cycle
        draw()
      }
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      wakeRef.current = null
      rebuildRef.current = null
      if (import.meta.env.DEV) delete w.__liquidMetalDebug
      gl.deleteTexture(tex)
      gl.deleteBuffer(vbo)
      gl.deleteBuffer(ibo)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
    }
  }, [])

  // 링 두께·여백이 바뀌면 지오메트리만 다시 만듭니다 (캔버스 크기는 부모가 바꿔 줍니다)
  useEffect(() => {
    ringRef.current = ring
    marginRef.current = margin
    rebuildRef.current?.()
  }, [ring, margin])

  // 속도·테마·색 보정이 바뀌면 루프가 읽는 값을 갱신하고 깨워서 다시 그립니다
  // (rate 가 0 이면 한 장만 그리고 멈추므로, 깨우지 않으면 변경이 반영되지 않습니다)
  useEffect(() => {
    rateRef.current = rate
    darkRef.current = dark
    adjustRef.current = adjust
    wakeRef.current?.()
  }, [rate, dark, adjust])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
