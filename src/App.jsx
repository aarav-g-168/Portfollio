import Navbar from './components/Navbar'
import Welcome from './components/Welcome'
import Dock from './components/Dock'
import TerminalWindow from './windows/Terminal'
import SafariWindow from './windows/Safari'
import { lazy, Suspense, useState } from 'react'
import { StartHere } from './components/PortfolioGuide'
import useLocationStore from './store/location'
import useWindowStore from './store/window'
import FinderWindow from './windows/Finder'
import TextWindow from './windows/Text'
import ImageWindow from './windows/Image'
import ContactWindow from './windows/Contact'
import PhotosWindow from './windows/Photos'
import ExperienceWindow from './windows/Experience'
import CodingWindow from './windows/Coding'
import ArchiveWindow from './windows/Archive'
import Home from './components/Home'

import GSAP from 'gsap';
import {Draggable} from "gsap/Draggable";
GSAP.registerPlugin(Draggable);

const ResumeWindow = lazy(() => import('./windows/Resume'));

const App = () => {
  const [showStart, setShowStart] = useState(() => { try { return localStorage.getItem('portfolio-start-dismissed') !== 'true'; } catch { return true; } });
  const [guideOpen, setGuideOpen] = useState(() => { try { return localStorage.getItem('portfolio-tour-seen-v1') ? null : 'invite'; } catch { return 'invite'; } });
  const openEssential = (key) => {
    if (key === 'finder') useLocationStore.getState().resetActiveLocation();
    useWindowStore.getState().openWindow(key);
  };
  const setStartVisibility = (visible) => {
    setShowStart(visible);
    try { localStorage.setItem('portfolio-start-dismissed', String(!visible)); } catch { /* Still usable when storage is unavailable. */ }
  };
  const resumeRequested = useWindowStore((state) => state.windows.resume.hasOpened);
  return (
    <main className={showStart ? 'has-start-card' : ''}>
      <Navbar guideOpen={guideOpen} onGuideChange={setGuideOpen} onShowStart={() => setStartVisibility(true)} />
      <Welcome />
      {showStart && <StartHere onOpen={openEssential} onExplore={() => setGuideOpen('tour')} onDismiss={() => setStartVisibility(false)} />}
      <Dock />

      <TerminalWindow />
      <SafariWindow />
      {resumeRequested && <Suspense fallback={<p className="resume-loading" role="status">Opening résumé…</p>}><ResumeWindow /></Suspense>}
      <FinderWindow />
      <TextWindow />
      <ImageWindow />
      <ContactWindow />
      <PhotosWindow />
      <ExperienceWindow />
      <CodingWindow />
      <ArchiveWindow />
      <Home />
    </main>
  )
}

export default App
