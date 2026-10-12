import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const resumeOnly = /^\/resume\/?$/.test(window.location.pathname);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {resumeOnly ? <iframe className="resume-only" src="/resume.pdf" title="Aarav Gupta’s résumé" /> : <App />}
  </StrictMode>
)
