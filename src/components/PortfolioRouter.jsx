import { lazy, Suspense } from 'react';

const Desktop = lazy(() => import('../App.jsx'));

export default function PortfolioRouter() {
  if (/^\/resume\/?$/.test(window.location.pathname)) return <iframe className="resume-only" src="/resume.pdf" title="Aarav Gupta’s résumé" />;
  return <Suspense fallback={<p className="resume-loading" role="status">Opening desktop…</p>}><Desktop /></Suspense>;
}
