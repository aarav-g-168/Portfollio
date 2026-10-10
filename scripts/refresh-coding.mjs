import { mkdir, writeFile } from 'node:fs/promises';
import { getCodingProfile } from '../api/_lib/coding.js';

const platforms = ['leetcode', 'codeforces', 'codechef', 'github'];
const results = await Promise.all(platforms.map(async (platform) => [platform, await getCodingProfile(platform)]));
await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/coding-snapshot.json', import.meta.url), `${JSON.stringify(Object.fromEntries(results), null, 2)}\n`);
console.log('Saved verified coding profiles for:', platforms.join(', '));
