import { lazy, Suspense, useSyncExternalStore } from 'react';

const Desktop = lazy(() => import('../App.jsx'));
const BasicPortfolio = lazy(() => import('./BasicPortfolio.jsx'));
const CaseStudy = lazy(() => import('./portfolio/CaseStudy.jsx'));
const subscribeToRoute = (callback) => { window.addEventListener('popstate', callback); return () => window.removeEventListener('popstate', callback); };
const routeSnapshot = () => window.location.pathname + window.location.search;

export default function PortfolioRouter() {
  const route = useSyncExternalStore(subscribeToRoute, routeSnapshot, routeSnapshot);
  const [path] = route.split('?');
  if (/^\/resume\/?$/.test(path)) return <iframe className="resume-only" src="/resume.pdf" title="Aarav Gupta’s résumé" />;
  const portfolioHome = /^\/$/.test(path);
  const localPreview = import.meta.env.DEV && /^\/preview\/?$/.test(path);
  const projectMatch = path.match(/^\/(?:preview\/)?projects\/(hackgrid|contest-manager|ios-fusion)\/?$/);
  if (projectMatch) return <Suspense fallback={<p className="resume-loading" role="status">Opening project…</p>}><CaseStudy slug={projectMatch[1]} /></Suspense>;
  if (portfolioHome || localPreview) return <Suspense fallback={<p className="resume-loading" role="status">Opening portfolio…</p>}><BasicPortfolio /></Suspense>;
  if (/^\/desktop\/?$/.test(path)) return <Suspense fallback={<p className="resume-loading" role="status">Opening desktop…</p>}><Desktop /><a className="preview-desktop-return" href="/#desktop-preview">← Back to portfolio</a></Suspense>;
  return <main className="resume-loading"><h1>Page not found.</h1><a href="/">Back to portfolio</a></main>;
}
