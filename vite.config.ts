import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages 는 https://hayoung-99.github.io/ui-lab/ 아래에 올라가므로 CI 에서만
// BASE_PATH=/ui-lab/ 을 넣습니다. 로컬 dev 는 그대로 / 입니다.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
})
