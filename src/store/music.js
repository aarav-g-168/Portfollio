import { create } from 'zustand';

let pendingRequest = null;
const statuses = ['playing', 'recent', 'idle', 'unconfigured', 'unavailable'];

const useMusicStore = create((set, get) => ({
  activity: { status: 'loading', track: null, profileUrl: null, stale: false },
  refreshing: false,
  refresh: () => {
    if (pendingRequest) return pendingRequest;
    set({ refreshing: true });
    pendingRequest = (async () => {
      try {
        const response = await fetch('/api/music', { signal: AbortSignal.timeout(15000), headers: { Accept: 'application/json' } });
        const data = await response.json();
        if (!statuses.includes(data.status) || (!response.ok && data.status !== 'unavailable')) throw new Error('Music unavailable');
        if (['playing', 'recent'].includes(data.status) && (!data.track?.title || !data.track?.artist)) throw new Error('Invalid track');
        set({ activity: data });
      } catch {
        const previous = get().activity;
        set({ activity: previous.track
          ? { ...previous, status: 'recent', stale: true }
          : { status: 'unavailable', track: null, profileUrl: previous.profileUrl, stale: true } });
      } finally { set({ refreshing: false }); }
    })();
    return pendingRequest.finally(() => { pendingRequest = null; });
  },
}));

export default useMusicStore;
