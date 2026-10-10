import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {resolve} from 'path'
import {fileURLToPath} from 'url'
import codingHandler from './api/coding.js'
import { createMusicService } from './api/_lib/music.js'
import { createMusicHandler } from './api/music.js'

function portfolioApi(env) {
  const music = createMusicService({ readConfig: () => ({ username: env.LASTFM_USERNAME, apiKey: env.LASTFM_API_KEY }) });
  const routes = { '/api/coding': codingHandler, '/api/music': createMusicHandler(music.getActivity) };
  const configure = (server) => {
    server.middlewares.use((req, res, next) => {
      const handler = routes[new URL(req.url, 'http://localhost').pathname];
      if (!handler) return next();
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (data) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
      void handler(req, res);
    });
  };
  return { name: 'portfolio-api', configureServer: configure, configurePreviewServer: configure };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), portfolioApi(loadEnv(mode, process.cwd(), ''))],
  resolve: {
    alias: {
      "@": resolve(fileURLToPath(new URL('.', import.meta.url)), "src"),
    },
  },
}));
