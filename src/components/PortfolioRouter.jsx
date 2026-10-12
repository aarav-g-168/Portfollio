import { lazy, Suspense } from 'react';
import BasicPortfolio from './BasicPortfolio';

const Desktop = lazy(() => import('../App.jsx'));

export default function PortfolioRouter() {
  if (/^\/resume\/?$/.test(window.location.pathname)) return <iframe className="resume-only" src="/resume.pdf" title="Aarav Gupta’s résumé" />;
  if (/^\/desktop\/?$/.test(window.location.pathname)) return <Suspense fallback={<p className="resume-loading" role="status">Opening desktop…</p>}><Desktop /></Suspense>;
  return <BasicPortfolio />;
}
