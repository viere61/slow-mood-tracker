import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
}) 
=======
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
>>>>>>> d873b2b (2nd version, now: 1) added time gating function 2) able to delete all data or reset today's log status)
