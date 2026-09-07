import { useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import rimReferenceUrl from './rim-reference.png'

/*
 * 버튼 테두리 자리에 얹히는 링. 레퍼런스 영상을 그대로 재생합니다.
 *
 * 영상을 1/60초 간격으로 스냅샷 찍어 각 프레임에서 링 둘레의 색을 세 줄(안쪽·중간·
 * 바깥)로 뽑아 "둘레 × 시간" 텍스처(rim-reference.png)로 구워 두었습니다. 링은 그
 * 텍스처를 시간축으로 훑을 뿐이라 반사·무지개·속도 변화가 전부 영상과 같습니다.
 * 프레임 사이는 보간하고, 한 주기(영상과 가장 닮은 프레임으로 찾은 3.32초)가 끝나면
 * 첫 프레임으로 이어집니다. 텍스처는 scratchpad 의 build_rim_texture.py 로 만듭니다.
 *
 * 텍스처 배치: 가로 = 둘레 위치(왼쪽 위 모서리에서 시계 방향, 지오메트리의 uv.x 와 동일),
 * 세로 = [안쪽 줄 T행][중간 줄 T행][바깥 줄 T행].
 */

/** 텍스처의 한 줄(밴드)당 행 수 = 한 주기의 프레임 수. build_rim_texture.py 출력값. */
const ROWS_PER_BAND = 198
/** 한 주기의 길이(초). 위와 같은 스크립트가 잰 값. */
export const REFERENCE_PERIOD = 3.3217

interface MetalRimProps {
  /** 링 두께(px). */
  ring: number
  /** 캔버스가 버튼 박스보다 사방으로 얼마나 큰지(px). */
  margin: number
  /** 재생 속도. 1 이 영상과 같은 속도, 0 이면 정지. */
  rate: number
  /** 다크모드. 밝기만 뒤집어 흰↔검이 바뀌고 무지개 색은 남습니다. */
  dark: boolean
}

/** 알약 둘레를 따라가는 곡선. 왼쪽 위 모서리에서 시작해 시계 방향으로 돕니다. */
class StadiumCurve extends THREE.Curve<THREE.Vector3> {
  private readonly w: number
  private readonly h: number

  constructor(w: number, h: number) {
    super()
    this.w = w
    this.h = h
  }

  override getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const r = this.h / 2
    const L = this.w - this.h
    const P = 2 * L + 2 * Math.PI * r
    let s = t * P
    if (s < L) return target.set(-L / 2 + s, r, 0)
    s -= L
    if (s < Math.PI * r) {
      const a = Math.PI / 2 - s / r
      return target.set(L / 2 + r * Math.cos(a), r * Math.sin(a), 0)
    }
    s -= Math.PI * r
    if (s < L) return target.set(L / 2 - s, -r, 0)
    s -= L
    const a = -Math.PI / 2 - s / r
    return target.set(-L / 2 + r * Math.cos(a), r * Math.sin(a), 0)
  }
}

/**
 * 알약 둘레를 따라 폭 ring 의 평평한 띠를 만듭니다. uv.x = 둘레 위치, uv.y = 폭 방향
 * (0 안쪽 → 1 바깥). 색은 텍스처에서 오므로 입체 단면은 필요 없습니다.
 */
function buildRimGeometry(w: number, h: number, ring: number): THREE.BufferGeometry {
  const curve = new StadiumCurve(w, h)
  const along = 512
  const across = 8
  const positions: number[] = []
  const uvs: number[] = []
  const index: number[] = []

  for (let i = 0; i <= along; i++) {
    const t = (i % along) / along
    const p = curve.getPoint(t)
    const tan = curve.getTangent(t)
    // 시계 방향 곡선이므로 접선을 반시계로 90° 돌리면 바깥쪽 법선
    const nx = -tan.y
    const ny = tan.x
    for (let j = 0; j <= across; j++) {
      const u = j / across
      const off = (u - 0.5) * ring
      positions.push(p.x + nx * off, p.y + ny * off, 0)
      uvs.push(i / along, u)
    }
  }
  const row = across + 1
  for (let i = 0; i < along; i++) {
    for (let j = 0; j < across; j++) {
      const a = i * row + j
      const b = a + row
      index.push(a, a + 1, b, a + 1, b + 1, b)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(index)
  return geo
}

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

/*
 * 시간 t(0..1)에 해당하는 행을 두 개 골라 직접 섞습니다. 텍스처의 세로 방향 선형
 * 필터에 맡기면 밴드 경계에서 다음 밴드의 첫 행이 섞여 들어오기 때문입니다.
 * 폭 방향은 안쪽·중간·바깥 세 줄 사이를 uv.y 로 섞습니다.
 */
const fragmentShader = /* glsl */ `
uniform sampler2D uTex;
uniform float uTime;   // 주기 단위 (1 = 한 바퀴)
uniform float uRows;   // 밴드당 행 수
uniform float uInvert; // 0 = 라이트, 1 = 다크
varying vec2 vUv;

/*
 * 다크모드: 밝기(L)만 1-L 로 뒤집고 색차는 그대로 둡니다. 색까지 반전하면 무지개가
 * 보색으로 바뀌어 버립니다. 뒤집기는 sRGB(지각 밝기) 공간에서 해야 은색이 어두운
 * 차콜이 됩니다 — 선형 공간에서 뒤집으면 중간 회색으로 떠 버립니다.
 */
vec3 invertLightness(vec3 lin) {
  vec3 s = pow(max(lin, 0.0), vec3(1.0 / 2.2));
  float l = dot(s, vec3(0.299, 0.587, 0.114));
  vec3 chroma = s - l;
  vec3 flipped = clamp((1.0 - l) + chroma * 1.2, 0.0, 1.0);
  return pow(flipped, vec3(2.2));
}

vec3 sampleBand(float band, float t) {
  float row = t * uRows;
  float r0 = floor(row);
  float fr = row - r0;
  float r1 = mod(r0 + 1.0, uRows);
  float total = uRows * 3.0;
  vec3 a = texture2D(uTex, vec2(vUv.x, (band * uRows + r0 + 0.5) / total)).rgb;
  vec3 b = texture2D(uTex, vec2(vUv.x, (band * uRows + r1 + 0.5) / total)).rgb;
  return mix(a, b, fr);
}

void main() {
  float t = fract(uTime);
  float pos = clamp(vUv.y, 0.0, 1.0) * 2.0;   // 0 안쪽 … 2 바깥
  float b0 = floor(min(pos, 1.999));
  float f = pos - b0;
  vec3 c = mix(sampleBand(b0, t), sampleBand(b0 + 1.0, t), f);
  c = mix(c, invertLightness(c), uInvert);
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}
`

function Rim({ ring, margin, rate, dark }: MetalRimProps) {
  const size = useThree((s) => s.size)
  const get = useThree((s) => s.get)

  const geometry = useMemo(() => {
    const w = size.width - 2 * margin - ring
    const h = size.height - 2 * margin - ring
    return buildRimGeometry(w, h, ring)
  }, [size.width, size.height, margin, ring])
  useEffect(() => () => geometry.dispose(), [geometry])

  // 원근 카메라를 "z=0 평면에서 캔버스 높이가 딱 맞는" 거리에 둡니다 → 1 단위 = 1px.
  useEffect(() => {
    const cam = get().camera as THREE.PerspectiveCamera
    cam.fov = 35
    cam.aspect = size.width / size.height
    const D = size.height / 2 / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    cam.position.set(0, 0, D)
    cam.near = D - 50
    cam.far = D + 50
    cam.lookAt(0, 0, 0)
    cam.updateProjectionMatrix()
  }, [get, size.width, size.height])

  const material = useMemo(() => {
    const tex = new THREE.TextureLoader().load(rimReferenceUrl)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    tex.flipY = false // 텍스처 0행 = 첫 프레임이 위에 오도록
    return new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: tex },
        uTime: { value: 0 },
        uRows: { value: ROWS_PER_BAND },
        uInvert: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      // 평평한 띠라 감긴 방향에 따라 뒷면으로 잘릴 수 있으니 양면을 그립니다
      side: THREE.DoubleSide,
    })
  }, [])
  useEffect(
    () => () => {
      ;(material.uniforms.uTex.value as THREE.Texture).dispose()
      material.dispose()
    },
    [material],
  )

  useFrame((_, delta) => {
    material.uniforms.uTime.value += (delta / REFERENCE_PERIOD) * rate
    material.uniforms.uInvert.value = dark ? 1 : 0
  })

  // 정지 상태(demand)여도 테마가 바뀌면 한 장은 다시 그려야 합니다
  useEffect(() => {
    get().invalidate()
  }, [dark, get])

  // 개발 중 검사용: 백그라운드 탭에서는 rAF 가 멈춰서, 바깥에서 시간을 밀어 넣고
  // 한 장씩 그려 볼 수 있게 창에 걸어 둡니다. 프로덕션 빌드에는 들어가지 않습니다.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const w = window as unknown as {
      __liquidMetalDebug?: ((cycle: number) => void) & { get?: typeof get }
    }
    w.__liquidMetalDebug = (cycle: number) => {
      material.uniforms.uTime.value = cycle
      get().advance(performance.now())
    }
    w.__liquidMetalDebug.get = get
    return () => {
      delete w.__liquidMetalDebug
    }
  }, [get, material])

  return <mesh geometry={geometry} material={material} />
}

export function MetalRim(props: MetalRimProps) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, premultipliedAlpha: true }}
      dpr={[1, 2]}
      frameloop={props.rate === 0 ? 'demand' : 'always'}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Rim {...props} />
    </Canvas>
  )
}
