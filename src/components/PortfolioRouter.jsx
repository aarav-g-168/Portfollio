import { lazy, Suspense, useSyncExternalStore } from 'react';

const Desktop = lazy(() => import('../App.jsx'));
const BasicPortfolio = lazy(() => import('./BasicPortfolio.jsx'));
const subscribeToRoute = (callback) => { window.addEventListener('popstate', callback); return () => window.removeEventListener('popstate', callback); };
const routeSnapshot = () => window.location.pathname + window.location.search;

export default function PortfolioRouter() {
  const route = useSyncExternalStore(subscribeToRoute, routeSnapshot);
  const [path, search = ''] = route.split('?');
  if (/^\/resume\/?$/.test(path)) return <iframe className="resume-only" src="/resume.pdf" title="Aarav Gupta’s résumé" />;
  const previewHome = import.meta.env.VITE_PORTFOLIO_PREVIEW === 'true' && /^\/$/.test(path);
  const localPreview = import.meta.env.DEV && /^\/preview\/?$/.test(path);
  if (previewHome || localPreview) return <Suspense fallback={<p className="resume-loading" role="status">Opening portfolio…</p>}><BasicPortfolio /></Suspense>;
  const returnToPreview = (import.meta.env.DEV || import.meta.env.VITE_PORTFOLIO_PREVIEW === 'true') && /^\/desktop\/?$/.test(path) && new URLSearchParams(search).get('from') === 'preview';
  return <Suspense fallback={<p className="resume-loading" role="status">Opening desktop…</p>}><Desktop />{returnToPreview && <a className="preview-desktop-return" href={import.meta.env.DEV ? '/preview#desktop-preview' : '/#desktop-preview'}>← Back to portfolio</a>}</Suspense>;
}
