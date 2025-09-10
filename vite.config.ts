import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  esbuild: {
    legalComments: 'none'
  },
  build: {
    minify: false
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/element-variables.scss";'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
