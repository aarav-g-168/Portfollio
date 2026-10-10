const profiles = {
  leetcode: { handle: 'aarav_g_168', url: 'https://leetcode.com/u/aarav_g_168/' },
  codeforces: { handle: 'aarav_g_168', url: 'https://codeforces.com/profile/aarav_g_168' },
  codechef: { handle: 'aaravgupta1608', url: 'https://www.codechef.com/users/aaravgupta1608' },
  github: { handle: 'aarav-g-168', url: 'https://github.com/aarav-g-168' },
};

const cache = new Map();
let codeforcesQueue = Promise.resolve();
let lastCodeforcesCall = 0;
const number = (value) => Number.isFinite(Number(value)) ? Number(value) : null;

async function request(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('Profile service unavailable');
  return response;
}

// Codeforces permits one API request every two seconds. Serialize across users.
function codeforces(method) {
  const task = codeforcesQueue.then(async () => {
    const wait = Math.max(0, 2100 - (Date.now() - lastCodeforcesCall));
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
    lastCodeforcesCall = Date.now();
    const data = await (await request(`https://codeforces.com/api/${method}`)).json();
    if (data.status !== 'OK') throw new Error('Codeforces data unavailable');
    return data.result;
  });
  codeforcesQueue = task.catch(() => {});
  return task;
}

async function loadCodeforces() {
  const handle = profiles.codeforces.handle;
  const [user] = await codeforces(`user.info?handles=${handle}`);
  const history = await codeforces(`user.rating?handle=${handle}`);
  const submissions = await codeforces(`user.status?handle=${handle}&from=1&count=10000`);
  const solved = submissions.length < 10000 ? new Set(submissions.filter((entry) => entry.verdict === 'OK')
    .map((entry) => `${entry.problem.contestId ?? entry.problem.name}:${entry.problem.index}`)).size : null;
  return {
    rating: user.rating ?? null, bestRating: user.maxRating ?? null,
    rank: user.rank ?? 'Unrated', contests: history.length, solved,
    history: history.map((entry) => ({ rating: entry.newRating, date: new Date(entry.ratingUpdateTimeSeconds * 1000).toISOString(), name: entry.contestName })),
  };
}

async function loadLeetcode() {
  // Public profile fields used by LeetCode's own profile page. No credentials.
  const query = `query PortfolioProfile($username: String!) {
    matchedUser(username: $username) { username submitStatsGlobal { acSubmissionNum { difficulty count } } }
    userContestRanking(username: $username) { rating attendedContestsCount globalRanking }
    userContestRankingHistory(username: $username) { attended rating contest { title startTime } }
  }`;
  const response = await request('https://leetcode.com/graphql/', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { username: profiles.leetcode.handle } }),
  });
  const { data, errors } = await response.json();
  if (errors?.length || !data?.matchedUser) throw new Error('LeetCode data unavailable');
  const difficulty = Object.fromEntries(data.matchedUser.submitStatsGlobal.acSubmissionNum.map((item) => [item.difficulty.toLowerCase(), item.count]));
  const history = (data.userContestRankingHistory ?? []).filter((entry) => entry.attended)
    .map((entry) => ({ rating: Math.round(entry.rating), date: new Date(entry.contest.startTime * 1000).toISOString(), name: entry.contest.title }));
  return {
    rating: data.userContestRanking ? Math.round(data.userContestRanking.rating) : null,
    bestRating: history.length ? Math.max(...history.map((entry) => entry.rating)) : null,
    contests: data.userContestRanking?.attendedContestsCount ?? 0,
    solved: difficulty.all ?? 0, difficulty, history,
  };
}

async function loadCodechef() {
  const html = await (await request(profiles.codechef.url)).text();
  const rating = html.match(/class="rating-number"[^>]*>\s*(\d+)/)?.[1];
  const best = html.match(/Highest Rating\s*(\d+)/)?.[1];
  const solved = html.match(/Total Problems Solved:\s*(\d+)/)?.[1];
  const rawHistory = html.match(/var\s+all_rating\s*=\s*(\[[\s\S]*?\]);/)?.[1];
  if (!rating || !best || !rawHistory) throw new Error('CodeChef profile format changed');
  const history = JSON.parse(rawHistory).map((entry) => ({
    rating: number(entry.rating), name: entry.name.trim(),
    date: new Date(Date.UTC(Number(entry.getyear), Number(entry.getmonth) - 1, Number(entry.getday))).toISOString(),
  })).filter((entry) => entry.rating !== null);
  const starsHtml = html.match(/class="rating-star"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
  return { rating: number(rating), bestRating: number(best), solved: solved ? number(solved) : null,
    stars: (starsHtml.match(/&#9733;|★/g) ?? []).length, contests: history.length, history };
}

async function loadGithub() {
  const html = await (await request(`https://github.com/users/${profiles.github.handle}/contributions`)).text();
  const tooltips = new Map([...html.matchAll(/<tool-tip\b[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)]
    .map((match) => [match[1], Number((match[2].replace(/<[^>]*>/g, '').match(/([\d,]+) contributions?/)?.[1] ?? '0').replaceAll(',', ''))]));
  const today = new Date().toISOString().slice(0, 10);
  const days = [...html.matchAll(/<(?:td|rect)\b[^>]*data-date="[^"]+"[^>]*>/g)].map(([tag]) => ({
    date: tag.match(/data-date="([^"]+)"/)?.[1],
    level: Number(tag.match(/data-level="(\d+)"/)?.[1] ?? 0),
    count: tooltips.get(tag.match(/\bid="([^"]+)"/)?.[1]) ?? 0,
  })).filter((day) => day.date <= today).sort((a, b) => a.date.localeCompare(b.date));
  if (!days.length) throw new Error('GitHub activity unavailable');
  const total = html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1];
  return { contributions: total ? Number(total.replaceAll(',', '')) : days.reduce((sum, day) => sum + day.count, 0), days };
}

const loaders = { codeforces: loadCodeforces, leetcode: loadLeetcode, codechef: loadCodechef, github: loadGithub };

export async function getCodingProfile(platform) {
  if (!Object.hasOwn(loaders, platform)) throw new Error('Unknown platform');
  const cached = cache.get(platform);
  if (cached && Date.now() - cached.time < 15 * 60 * 1000) return cached.promise;
  const promise = loaders[platform]().then((stats) => ({ ...profiles[platform], ...stats, updatedAt: new Date().toISOString() }));
  cache.set(platform, { time: Date.now(), promise });
  promise.catch(() => { if (cache.get(platform)?.promise === promise) cache.delete(platform); });
  return promise;
}
