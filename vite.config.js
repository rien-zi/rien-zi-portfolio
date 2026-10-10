import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { portfolioSeo } from './scripts/portfolioSeo.mjs'
import tailwindcss from '@tailwindcss/vite'
import { avatarCsp } from './scripts/avatarCsp.mjs'

export default defineConfig({
  plugins: [avatarCsp(), react(), tailwindcss(), portfolioSeo()],
})
