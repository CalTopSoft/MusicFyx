import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/MusicFyx/',  // OJO: el nombre exacto de tu repo, respetando mayúsculas
})
