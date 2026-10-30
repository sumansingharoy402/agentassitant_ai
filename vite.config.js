import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // 🚨 এখানে আপনার API Key বসান
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify('AQ.Ab8RN6J8MYSQMg0OLQabRudTqmSZ-Fpvbx-DMAK9FPf33MKJQ')
  }
})