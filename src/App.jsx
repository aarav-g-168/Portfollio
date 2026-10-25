import Navbar from './components/Navbar'
import './index.css'
import Welcome from './components/Welcome'
import Dock from './components/Dock'
import TerminalWindow from './windows/Terminal'
import SafariWindow from './windows/Safari'
import { lazy, Suspense, useEffect, useState } from 'react'
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
  useEffect(() => { document.title = 'Aarav’s MacFolio'; }, []);
  const [guideOpen, setGuideOpen] = useState('invite');
  const resumeRequested = useWindowStore((state) => state.windows.resume.hasOpened);
  return (
    <main>
      <Navbar guideOpen={guideOpen} onGuideChange={setGuideOpen} />
      <Welcome />
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
