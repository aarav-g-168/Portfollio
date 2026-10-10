import { getMusicActivity } from './_lib/music.js';

export function createMusicHandler(getActivity = getMusicActivity) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const activity = await getActivity();
    return res.status(activity.status === 'unavailable' ? 503 : 200).json(activity);
  };
}

export default createMusicHandler();
