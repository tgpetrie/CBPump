import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'build',
        sourcemap: true
    },
    server: {
        port: 5173,
        strictPort: false,  // Allow Vite to find next available port
        host: true
    },
    preview: {
        port: 5173,
        strictPort: false,  // Allow Vite to find next available port
        host: true
    }
})
