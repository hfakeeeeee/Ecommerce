import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {  
  return {
    plugins: [react()],
    server: {
      port: 80,
      host: true,
    },
  }
})
