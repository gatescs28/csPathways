import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The course and career lists live in the repo's data/ folder, one level up.
  server: {
    fs: { allow: ['..'] },
  },
})
