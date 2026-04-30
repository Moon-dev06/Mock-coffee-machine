import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/coffeemachine/',
    plugins: [react()],
    server: {
      proxy: {
        '/api-proxy': {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy/, '')
        }
      }
    }
  }
})