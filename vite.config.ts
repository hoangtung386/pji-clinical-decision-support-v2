import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Quan trọng: Thay đổi base thành tên repository của bạn để GitHub Pages load đúng đường dẫn file CSS/JS.
  // Dựa trên screenshot của bạn: https://hoangtung386.github.io/pji-clinical-decision-support/
  base: '/pji-clinical-decision-support/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});