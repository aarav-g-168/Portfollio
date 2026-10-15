import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import PortfolioRouter from './components/PortfolioRouter';
import './components/portfolio/portfolio-base.css';

const app=<StrictMode><PortfolioRouter /></StrictMode>;
const root=document.getElementById('root');
if (root.dataset.prerendered==='true') hydrateRoot(root,app);
else createRoot(root).render(app);
