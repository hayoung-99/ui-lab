import type { FeatureMeta } from '../types';

export const meta: FeatureMeta = {
  title: 'Liquid Metal Button',
  summary: '레퍼런스 영상을 텍스처 한 장으로 구워 WebGL 로 재생하는 액체 금속 링 버튼',
  description:
    '레퍼런스 영상의 링 둘레 색을 "둘레 × 시간" 텍스처(PNG 한 장, 512×594)로 구워 순수 WebGL2 셰이더로 재생하는 React 액체 금속 링 버튼. three.js 없이 draw call 하나로 반사·무지개 프린지·속도 변화를 영상 그대로 재현하고, 밝기·대비·채도·색조는 셰이더에서 실시간으로 보정하며, 다크 모드는 밝기만 반전해 무지개 색을 보존합니다.',
  keywords: ['WebGL', 'GLSL', 'React', 'Button', 'Liquid Metal', 'Shader', 'Texture'],
  programmingLanguage: ['TypeScript', 'GLSL'],
  createdAt: '2026-09-04',
  updatedAt: '2026-09-07',
};
