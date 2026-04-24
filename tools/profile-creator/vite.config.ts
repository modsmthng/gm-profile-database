import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [preact(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
});
