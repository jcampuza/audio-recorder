import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import analyze from 'rollup-plugin-analyzer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      plugins: [analyze()],
    },
  },
});
