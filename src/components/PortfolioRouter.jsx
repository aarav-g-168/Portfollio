import { lazy, Suspense } from 'react';

const Desktop = lazy(() => import('../App.jsx'));
const BasicPortfolio = lazy(() => import('./BasicPortfolio.jsx'));

export default function PortfolioRouter() {
  if (/^\/resume\/?$/.test(window.location.pathname)) return <iframe className="resume-only" src="/resume.pdf" title="Aarav Gupta’s résumé" />;
  const path = window.location.pathname;
  const previewHome = import.meta.env.VITE_PORTFOLIO_PREVIEW === 'true' && /^\/$/.test(path);
  const localPreview = import.meta.env.DEV && /^\/preview\/?$/.test(path);
  if (previewHome || localPreview) return <Suspense fallback={<p className="resume-loading" role="status">Opening portfolio…</p>}><BasicPortfolio /></Suspense>;
  return <Suspense fallback={<p className="resume-loading" role="status">Opening desktop…</p>}><Desktop /></Suspense>;
}
