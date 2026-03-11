import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/health': { target: 'http://localhost:8000', changeOrigin: true },
            '/predict': { target: 'http://localhost:8000', changeOrigin: true },
            '/predictions': { target: 'http://localhost:8000', changeOrigin: true },
            '/prediction-stats': { target: 'http://localhost:8000', changeOrigin: true },
            '/model-metrics': { target: 'http://localhost:8000', changeOrigin: true },
        },
    },
    build: {
        outDir: '../backend/static',
        emptyOutDir: true,
    },
})
