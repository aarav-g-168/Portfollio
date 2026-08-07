import React from 'react'
import Navbar from './components/Navbar'
import Welcome from './components/Welcome'
import Dock from './components/Dock'
import TerminalWindow from './windows/Terminal'
import SafariWindow from './windows/Safari'
import ResumeWindow from './windows/Resume'

import GSAP from 'gsap';
import {Draggable} from "gsap/Draggable";
GSAP.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />

      <TerminalWindow />
      <SafariWindow />
      <ResumeWindow />
    </main>
  )
}

export default App