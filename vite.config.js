import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/telegramBot/",
  server: {
    allowedHosts: [
      '9351262d9857.ngrok-free.app',
    ]
  }
})