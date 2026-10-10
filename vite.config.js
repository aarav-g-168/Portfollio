import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {resolve} from 'path'
import {fileURLToPath} from 'url'
import codingHandler from './api/coding.js'

function codingApi() {
  const configure = (server) => {
    server.middlewares.use((req, res, next) => {
      if (new URL(req.url, 'http://localhost').pathname !== '/api/coding') return next();
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (data) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
      void codingHandler(req, res);
    });
  };
  return { name: 'portfolio-coding-api', configureServer: configure, configurePreviewServer: configure };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), codingApi()],
  resolve: {
    alias: {
      "@": resolve(fileURLToPath(new URL('.', import.meta.url)), "src"),
    },
  },
});
