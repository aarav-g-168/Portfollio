import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PortfolioRouter from './components/PortfolioRouter.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PortfolioRouter />
  </StrictMode>
)
