import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Quan trọng: Thiết lập base là './' để các tài nguyên (js, css) được liên kết tương đối.
  // Điều này giúp ứng dụng chạy đúng trên GitHub Pages (thường nằm trong thư mục con /repo-name/).
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});