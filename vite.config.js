import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexiones desde cualquier dispositivo en la red local
    port: 3000, // O el puerto que prefieras
    strictPort: true, // No usa otro puerto si el 3000 está ocupado
  },
})
