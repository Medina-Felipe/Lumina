import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Permite usar describe, test, expect sin importarlos
    environment: 'jsdom', // Simula un navegador
    setupFiles: './src/setupTests.js', // Archivo de configuración inicial
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'], // 'lcov' es el que lee SonarQube
      reportsDirectory: './coverage'
    }
  }
})