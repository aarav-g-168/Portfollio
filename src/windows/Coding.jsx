import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BarChart3, Code2, RefreshCw, Trophy } from 'lucide-react';
import WindowWrapper from '../hoc/WindowWrapper';
import WindowControls from '../components/WindowControls';
import useWindowStore from '../store/window';
import snapshot from '../data/coding-snapshot.json';

const platforms = [
  { id: 'codechef', name: 'CodeChef', mark: 'CC', subtitle: 'Competitive programming' },
  { id: 'codeforces', name: 'Codeforces', mark: 'CF', subtitle: 'Rated contests & algorithms' },
  { id: 'leetcode', name: 'LeetCode', mark: 'LC', subtitle: 'Practice & problem solving' },
];
const format = (value) => value == null ? '—' : value.toLocaleString('en-US');
const date = (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const RatingChart = ({ history, name }) => {
  const [inspected, setInspected] = useState(null);
  const [plotWidth, setPlotWidth] = useState(624);
  const plotRef = useRef(null);
  useEffect(() => {
    if (!plotRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setPlotWidth(Math.max(220, Math.round(entry.contentRect.width)));
    });
    observer.observe(plotRef.current);
    return () => observer.disconnect();
  }, [history?.length]);
  if (!history?.length) return <p className="coding-empty">No rated contests yet.</p>;
  const active = Math.min(inspected ?? history.length - 1, history.length - 1);
  const lowest = Math.min(...history.map((entry) => entry.rating));
  const highest = Math.max(...history.map((entry) => entry.rating));
  const min = Math.floor((lowest - 70) / 100) * 100;
  const max = Math.ceil((highest + 70) / 100) * 100;
  const points = history.map((entry, index) => ({ ...entry,
    x: 40 + index / Math.max(history.length - 1, 1) * (plotWidth - 56),
    y: 25 + (max - entry.rating) / Math.max(max - min, 1) * 150,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(' ');
  const selected = points[active];
  return <div className="rating-chart" ref={plotRef}>
    <svg viewBox={`0 0 ${plotWidth} 210`} role="img" aria-label={`${name} rating progression across ${history.length} contests. Latest ${history.at(-1).rating}, highest ${highest}.`}>
      {[max, Math.round((max + min) / 2), min].map((tick, index) => <g key={index}><line x1="40" x2={plotWidth - 16} y1={25 + index * 75} y2={25 + index * 75} stroke="#e5e7eb" strokeDasharray="4 5" /><text x="0" y={29 + index * 75} fill="#6b7280" fontSize="10">{tick}</text></g>)}
      <polygon points={`40,175 ${line} ${plotWidth - 16},175`} fill="currentColor" opacity="0.07" />
      <polyline points={line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={selected.x} x2={selected.x} y1="25" y2="175" stroke="currentColor" opacity="0.25" />
      {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={index === active ? 5 : 3} fill={index === active ? 'currentColor' : 'white'} stroke="currentColor" strokeWidth="2" onPointerEnter={() => setInspected(index)}><title>{point.name}: {point.rating}</title></circle>)}
      <text x="40" y="202" fill="#6b7280" fontSize="10">{date(history[0].date)}</text>
      <text x={plotWidth - 16} y="202" textAnchor="end" fill="#6b7280" fontSize="10">{date(history.at(-1).date)}</text>
    </svg>
    <div className="rating-inspector"><span><strong>{selected.rating}</strong><small>{selected.name} · {date(selected.date)}</small></span>
      <input type="range" min="0" max={Math.max(history.length - 1, 0)} value={active} aria-label={`Explore ${name} contest history`}
        aria-valuetext={`${selected.name}, rating ${selected.rating}, ${date(selected.date)}`} onChange={(event) => setInspected(Number(event.target.value))} />
    </div>
  </div>;
};

const GithubActivity = ({ data }) => {
  const days = data.days ?? [];
  const offset = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0;
  return <section className="coding-panel github-activity">
    <div className="coding-panel-heading"><div><h3>Development activity</h3><p>{format(data.contributions)} contributions in the last year</p></div><a href={data.url} target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile"><Code2 size={18} /><ArrowUpRight size={14} /></a></div>
    <div className="github-calendar-scroll"><div className="github-calendar" role="img" aria-label={`${data.contributions} GitHub contributions in the last year. Open the GitHub profile for full activity details.`}>
      {Array.from({ length: offset }, (_, index) => <span key={`empty-${index}`} className="calendar-empty" />)}
      {days.map((day) => <span key={day.date} data-level={day.level} title={`${day.date}: ${day.count} contributions`} />)}
    </div></div>
    <div className="github-calendar-footer"><span>@{data.handle}</span><span>Less <i data-level="0" /><i data-level="1" /><i data-level="2" /><i data-level="3" /><i data-level="4" /> More</span></div>
  </section>;
};

const Coding = () => {
  const { windows } = useWindowStore();
  const isOpen = windows.coding.isOpen;
  const [selected, setSelected] = useState('overview');
  const [profiles, setProfiles] = useState(snapshot);
  const [live, setLive] = useState({});
  const [checked, setChecked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const loading = !checked || refreshing;
  const controller = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [selected]);

  const refresh = useCallback(() => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    return Promise.allSettled(Object.keys(snapshot).map(async (platform) => {
        const response = await fetch(`/api/coding?platform=${platform}`, { signal: current.signal });
        if (!response.ok) throw new Error('Live stats unavailable');
        const data = await response.json();
        if (data.handle !== snapshot[platform].handle || !data.updatedAt) throw new Error('Invalid profile');
        return data;
    })).then((results) => {
      if (current.signal.aborted) return;
      const updates = {};
      const availability = {};
      results.forEach((result, index) => {
        const platform = Object.keys(snapshot)[index];
        availability[platform] = result.status === 'fulfilled';
        if (result.status === 'fulfilled') updates[platform] = result.value;
      });
      setProfiles((previous) => ({ ...previous, ...updates }));
      setLive(availability);
      setChecked(true);
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    void refresh();
    return () => controller.current?.abort();
  }, [isOpen, refresh]);

  const platform = platforms.find((entry) => entry.id === selected);
  const data = profiles[selected];
  const totalSolved = platforms.reduce((sum, entry) => sum + (profiles[entry.id].solved ?? 0), 0);

  return <div className="coding-window">
    <div id="window-header"><WindowControls windowKey="coding" /><h2><Trophy size={16} aria-hidden="true" /> Competitive Programming</h2><button type="button" className="coding-refresh" disabled={loading} onClick={() => { setRefreshing(true); void refresh(); }} aria-label="Refresh coding stats" title="Refresh stats"><RefreshCw size={15} className={loading ? 'coding-spinning' : ''} /></button></div>
    <div className="coding-layout">
      <aside className="coding-sidebar" aria-label="Coding platforms">
        <h3>Problem solving</h3>
        <button type="button" className={selected === 'overview' ? 'selected' : ''} aria-current={selected === 'overview' ? 'page' : undefined} onClick={() => setSelected('overview')}><BarChart3 size={17} /> Overview</button>
        <h3>Platforms</h3>
        {platforms.map((entry) => <button key={entry.id} type="button" className={selected === entry.id ? 'selected' : ''} aria-current={selected === entry.id ? 'page' : undefined} onClick={() => setSelected(entry.id)}><span className={`platform-mark ${entry.id}`}>{entry.mark}</span>{entry.name}</button>)}
        <button type="button" className={selected === 'github' ? 'selected' : ''} aria-current={selected === 'github' ? 'page' : undefined} onClick={() => setSelected('github')}><Code2 size={17} /> GitHub</button>
      </aside>
      <div className="coding-content" ref={contentRef}>
        <div className="coding-content-inner">
        {selected === 'overview' ? <>
          <div className="coding-page-heading"><span className="coding-eyebrow">CONSISTENCY, ONE PROBLEM AT A TIME</span><h3>Problem solving, in practice.</h3><p>Contests, algorithms, and the work between them.</p></div>
          <div className="coding-summary"><span><strong>{format(totalSolved)}</strong><small>Problems solved across platforms</small></span><span><strong>3</strong><small>Coding profiles</small></span><span><strong>{format(profiles.github.contributions)}</strong><small>GitHub contributions · past year</small></span></div>
          <div className="coding-platform-grid">{platforms.map((entry) => <button type="button" key={entry.id} className={`coding-platform-card ${entry.id}`} onClick={() => setSelected(entry.id)}>
            <span className="coding-card-top"><span className={`platform-mark ${entry.id}`}>{entry.mark}</span><span className="coding-card-name">{entry.name}</span><ArrowUpRight size={15} /></span><span className="coding-card-rating">{format(profiles[entry.id].rating)}<small>Contest rating</small></span><span className="coding-card-bottom">{format(profiles[entry.id].contests)} rated contests <span>Explore →</span></span>
          </button>)}</div>
          <GithubActivity data={profiles.github} />
          <p className="coding-source-note">{loading ? 'Checking the latest public stats…' : 'Stats from public profiles. Saved snapshots stay available when live updates cannot be reached.'}</p>
        </> : selected === 'github' ? <>
          <div className="coding-page-heading"><span className="coding-eyebrow">BUILDING IN PUBLIC</span><h3>GitHub activity</h3><p>A year of contributions, at a glance.</p></div><GithubActivity data={data} />
          <p className="coding-source-note">{live.github ? 'Synced' : 'Saved snapshot'} · {date(data.updatedAt)}</p>
        </> : <>
          <div className="coding-profile-heading"><span className={`platform-mark large ${selected}`}>{platform.mark}</span><div><h3>{platform.name}</h3><p>@{data.handle}{data.rank ? ` · ${data.rank}` : data.stars ? ` · ${data.stars} stars` : ''}</p></div><a href={data.url} target="_blank" rel="noopener noreferrer">View profile <ArrowUpRight size={14} /></a></div>
          <div className="coding-metrics"><span><small>Current rating</small><strong>{format(data.rating)}</strong></span><span><small>Best rating</small><strong>{format(data.bestRating)}</strong></span><span><small>Rated contests</small><strong>{format(data.contests)}</strong></span><span><small>Problems solved</small><strong>{format(data.solved)}</strong></span></div>
          <section className={`coding-panel rating-panel ${selected}`}><div className="coding-panel-heading"><div><h4>Rating progression</h4><p>Explore each rated contest.</p></div><span>{data.history.length} contests</span></div><RatingChart key={selected} history={data.history} name={platform.name} /></section>
          {data.difficulty && <section className="coding-panel"><h4>Problems by difficulty</h4><div className="coding-difficulty">{['easy', 'medium', 'hard'].map((difficulty) => <span key={difficulty} className={difficulty}><small>{difficulty}</small><strong>{data.difficulty[difficulty]}</strong><progress value={data.difficulty[difficulty]} max={Math.max(data.solved, 1)} aria-label={`${difficulty} problems solved`} /></span>)}</div></section>}
          <section className="coding-panel"><h4>Recent contests</h4><ul className="coding-recent-contests">{data.history.slice(-4).reverse().map((contest, index) => <li key={index}><span><strong>{contest.name}</strong><small>{date(contest.date)}</small></span><b>{contest.rating}</b></li>)}</ul></section>
          <p className="coding-source-note">{loading ? 'Checking for updates…' : live[selected] ? 'Synced from public profile' : 'Saved snapshot'} · {date(data.updatedAt)}</p>
        </>}
        </div>
      </div>
    </div>
  </div>;
};

const CodingWindow = WindowWrapper(Coding, 'coding');
export default CodingWindow;
