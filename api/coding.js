import { getCodingProfile } from './_lib/coding.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  const platform = new URL(req.url, 'http://localhost').searchParams.get('platform');
  if (!['leetcode', 'codeforces', 'codechef', 'github'].includes(platform)) return res.status(400).json({ error: 'Unknown platform' });
  try {
    const data = await getCodingProfile(platform);
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=900');
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: 'Live stats are temporarily unavailable. Your saved profile is still available.' });
  }
}
