import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 1. Explicitly set the base path
      base: '/', 
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // 2. Ensure alias points correctly to the root
          '@': path.resolve(__dirname, './'),
        }
      },
      build: {
        // 3. Ensure Vite looks for index.html in the root
        outDir: 'dist',
        rollupOptions: {
          input: path.resolve(__dirname, 'index.html'),
        }
      }
    };
});
