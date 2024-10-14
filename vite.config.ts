import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dotenv from 'dotenv'

dotenv.config(); 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    vueDevTools(),
  ],
  define: {
    'process.env': process.env
  }
})
