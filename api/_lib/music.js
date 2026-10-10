const CACHE_MS = 20000;
const RETRY_MS = 60000;

const safeUrl = (value, hosts) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)) ? url.href : null;
  } catch { return null; }
};

export function normalizeRecentTracks(data, username, timestamp) {
  const entries = data?.recenttracks?.track;
  if (!data?.recenttracks || (entries != null && !Array.isArray(entries) && typeof entries !== 'object')) {
    throw new Error('Invalid music response');
  }
  const recent = Array.isArray(entries) ? entries[0] : entries;
  const profileUrl = `https://www.last.fm/user/${encodeURIComponent(username)}`;
  const base = { source: 'lastfm', profileUrl, checkedAt: new Date(timestamp).toISOString(), stale: false };
  if (!recent?.name) return { ...base, status: 'idle', track: null };
  const artist = typeof recent.artist === 'string' ? recent.artist : recent.artist?.['#text'];
  const image = [...(Array.isArray(recent.image) ? recent.image : [])].reverse()
    .map((entry) => safeUrl(entry?.['#text'], ['lastfm.freetls.fastly.net', 'lastfm-img2.akamaized.net']))
    .find(Boolean) || null;
  const playedAt = Number(recent.date?.uts);
  const playing = recent['@attr']?.nowplaying === 'true';
  return {
    ...base, status: playing ? 'playing' : 'recent',
    track: {
      title: String(recent.name).slice(0, 300), artist: String(artist || 'Unknown artist').slice(0, 300),
      album: String(recent.album?.['#text'] || '').slice(0, 300), imageUrl: image,
      url: safeUrl(recent.url, ['last.fm']),
      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(`${recent.name} ${artist || ''}`.trim())}`,
      lastPlayedAt: !playing && Number.isFinite(playedAt) && playedAt > 0 ? new Date(playedAt * 1000).toISOString() : null,
    },
  };
}

export function createMusicService({
  readConfig = () => ({ username: process.env.LASTFM_USERNAME, apiKey: process.env.LASTFM_API_KEY }),
  fetchImpl = fetch, now = Date.now,
} = {}) {
  let cached = null;
  let expiresAt = 0;
  let pending = null;
  let identity = '';

  async function getActivity() {
    const config = readConfig();
    const username = String(config.username || '').trim();
    const apiKey = String(config.apiKey || '').trim();
    const currentIdentity = `${username}:${apiKey}`;
    if (identity !== currentIdentity) { identity = currentIdentity; cached = null; expiresAt = 0; }
    if (!/^[a-z][\w-]{1,14}$/i.test(username) || !apiKey) {
      return { status: 'unconfigured', source: 'lastfm', track: null, profileUrl: null, checkedAt: null, stale: false };
    }
    if (cached && now() < expiresAt) return cached;
    if (pending) return pending;

    pending = (async () => {
      let retryMs = RETRY_MS;
      try {
        const url = new URL('https://ws.audioscrobbler.com/2.0/');
        url.search = new URLSearchParams({ method: 'user.getrecenttracks', user: username, api_key: apiKey, format: 'json', limit: '1' }).toString();
        const response = await fetchImpl(url, { signal: AbortSignal.timeout(10000), headers: { Accept: 'application/json' } });
        if (response.status === 429) {
          retryMs = Math.max(RETRY_MS, Math.min(300000, Number(response.headers.get('Retry-After')) * 1000 || RETRY_MS));
        }
        if (!response.ok) throw new Error('Music service unavailable');
        const data = await response.json();
        if (data.error) throw new Error('Music service returned an error');
        cached = normalizeRecentTracks(data, username, now());
        expiresAt = now() + CACHE_MS;
      } catch {
        // Never expose upstream errors: their request URL may contain the API key.
        cached = cached?.track ? { ...cached, status: 'recent', stale: true } : {
          status: 'unavailable', source: 'lastfm', track: null,
          profileUrl: `https://www.last.fm/user/${encodeURIComponent(username)}`, checkedAt: null, stale: true,
        };
        expiresAt = now() + retryMs;
      }
      return cached;
    })();
    try { return await pending; } finally { pending = null; }
  }
  return { getActivity };
}

const musicService = createMusicService();
export const getMusicActivity = () => musicService.getActivity();
