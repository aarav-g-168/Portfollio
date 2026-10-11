import codingHandler from '../api/coding.js';
import { createMusicHandler } from '../api/music.js';
import { createMusicService } from '../api/_lib/music.js';

let music;
let musicConfig;

// Adapt the shared Node-style handlers to Workers' standard Request/Response API.
async function runHandler(handler, request) {
  const headers = new Headers();
  let status = 200;
  let response;
  const res = {
    setHeader(name, value) { headers.set(name, value); },
    status(code) { status = code; return res; },
    json(data) { response = Response.json(data, { status, headers }); return response; },
  };
  await handler({ method: request.method, url: request.url }, res);
  return response;
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    try {
      if (path === '/api/coding') return await runHandler(codingHandler, request);
      if (path === '/api/music') {
        if (!music || musicConfig.username !== env.LASTFM_USERNAME || musicConfig.apiKey !== env.LASTFM_API_KEY) {
          musicConfig = { username: env.LASTFM_USERNAME, apiKey: env.LASTFM_API_KEY };
          const config = musicConfig;
          music = createMusicService({ readConfig: () => config });
        }
        return await runHandler(createMusicHandler(music.getActivity), request);
      }
      if (path.startsWith('/api/')) return Response.json({ error: 'Not found' }, { status: 404 });
      return await env.ASSETS.fetch(request);
    } catch {
      // Keep upstream request URLs and credentials out of public errors.
      return Response.json({ error: 'Service temporarily unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
  },
};
