import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import PortfolioRouter from './components/PortfolioRouter.jsx'

const app = (
  <StrictMode>
    <PortfolioRouter />
  </StrictMode>
)
const root = document.getElementById('root')
if (root.dataset.prerendered === 'true') hydrateRoot(root, app)
else createRoot(root).render(app)
