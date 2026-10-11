import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, X } from 'lucide-react';
import useWindowStore from '../store/window';

const steps = [
  { target: '#dock', title: 'Your apps live in the dock.', text: 'Click an icon to open its window. Click again to close it. The small dot tells you which apps are open.' },
  { target: '#portfolio-spotlight', panel: 'spotlight', title: 'Find anything with Spotlight.', text: 'Search projects, skills, photos, and apps here. Use the search icon or Ctrl / ⌘ K whenever you need a shortcut.' },
  { target: '.spotify-notch', panel: 'spotify', title: 'There’s music in the notch.', text: 'Hover over the music icon for a peek, then click to see my current or latest listen. The arrow finds that track on Spotify.' },
  { target: '#coding', app: 'coding', title: 'Beyond the project portfolio.', text: 'The chart icon opens my competitive programming profiles: CodeChef, Codeforces, and LeetCode. Explore contest ratings and problem-solving activity.' },
  { target: '#portfolio-control-center', panel: 'controls', title: 'Make this desktop yours.', text: 'Control Center adjusts wallpaper brightness, enables a quieter Focus view, and gives you quick shortcuts. These settings only affect your visit.' },
  { target: '#desktop-widgets', panel: 'widgets', title: 'Click the date for a little context.', text: 'Your local clock and calendar sit alongside my India time, plus shortcuts to write a message or read my résumé.' },
  { target: '#photos', app: 'photos', title: 'A glimpse beyond the code.', text: 'Gallery separates Personal and Social photos. Search the collection and save favorites in your browser.' },
  { target: '#safari', app: 'safari', title: 'The story behind the work.', text: 'Build Notes contains project decisions and things I’ve learned. Search notes, pin a favorite, or follow a link into its project.' },
  { target: '#trash', app: 'trash', title: 'An archive, not a dead end.', text: 'Find parked ideas and archived notes here. Restore a note to Build Notes. Your changes stay in this browser.' },
  { target: '#terminal', app: 'terminal', title: 'Skills, with a terminal feel.', text: 'The terminal icon opens the technologies I work with. Window controls work everywhere: red closes, yellow minimizes, and green expands.' },
  { target: '.apple-menu', title: 'You’re ready to explore.', text: 'Projects, Experience, Contact, and Resume are always in the menu bar. Replay this tour from the Apple menu whenever you like.' },
];

export default function GuidedTour({ mode, onStart, onClose, onPanel }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null);
  const frameRef = useRef(null);
  const cardRef = useRef(null);
  const nextRef = useRef(null);
  const step = steps[index];
  const touring = mode === 'tour';

  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
  }, []);

  useEffect(() => {
    if (!touring) return;
    onPanel(step.panel ?? null);
    const store = useWindowStore.getState();
    const previousWindow = step.app && store.windows[step.app];
    const wasOpen = previousWindow?.isOpen && !['close', 'minimize'].includes(previousWindow.transition?.type);
    if (step.app) store.openWindow(step.app);
    nextRef.current?.focus();
    let frame;
    const position = () => {
      const target = document.querySelector(step.target);
      const rect = target?.getBoundingClientRect();
      const highlight = frameRef.current;
      const card = cardRef.current;
      if (rect && highlight && card) {
        const width = window.innerWidth, height = window.innerHeight;
        const x = Math.max(6, rect.left - 5), y = Math.max(6, rect.top - 5);
        Object.assign(highlight.style, { left: `${x}px`, top: `${y}px`, width: `${Math.max(0, Math.min(width - x - 6, rect.width + 10))}px`, height: `${Math.max(0, Math.min(height - y - 6, rect.height + 10))}px` });
        const cardHeight = card.offsetHeight, cardWidth = card.offsetWidth;
        const below = rect.bottom + 18;
        let top = below + cardHeight < height - 16 ? below : rect.top - cardHeight - 18 > 16 ? rect.top - cardHeight - 18 : height - cardHeight - 16;
        let left = Math.max(16, Math.min(width - cardWidth - 16, rect.left + rect.width / 2 - cardWidth / 2));
        if (below + cardHeight >= height - 16 && rect.left > cardWidth + 34) {
          left = rect.left - cardWidth - 18;
          top = Math.min(height - cardHeight - 16, Math.max(16, rect.top + 24));
        }
        Object.assign(card.style, { left: `${left}px`, top: `${Math.max(16, top)}px` });
      }
      frame = requestAnimationFrame(position);
    };
    frame = requestAnimationFrame(position);
    return () => {
      cancelAnimationFrame(frame);
      onPanel(null);
      if (step.app && !wasOpen) useWindowStore.getState().minimizeWindow(step.app);
    };
  }, [touring, step, onPanel]);

  return <dialog ref={dialogRef} className={`tour-layer ${touring ? 'is-touring' : 'is-invitation'}`} aria-labelledby="tour-title" aria-describedby="tour-copy" onCancel={onClose}>
    {touring && <div ref={frameRef} className="tour-highlight" aria-hidden="true" />}
    <section ref={cardRef} className="tour-card">
      <header><span><Compass size={17} aria-hidden="true" /> {touring ? 'DESKTOP TOUR' : 'WELCOME TO MY DESKTOP'}</span><button type="button" aria-label={touring ? 'Skip tour' : 'Continue without tour'} onClick={onClose}><X size={18} /></button></header>
      <div aria-live="polite" aria-atomic="true"><h2 id="tour-title">{touring ? step.title : 'A familiar desktop. A few surprises.'}</h2><p id="tour-copy">{touring ? step.text : 'Take a quick guided tour of the little details, or jump straight into my work. You can skip the tour at any point.'}</p></div>
      {touring ? <><div className="tour-progress" aria-label={`Step ${index + 1} of ${steps.length}`}><span style={{ width: `${(index + 1) / steps.length * 100}%` }} /></div><footer><button type="button" className="tour-skip" onClick={onClose}>Skip tour</button><span>{index + 1} / {steps.length}</span><button type="button" aria-label="Previous step" disabled={index === 0} onClick={() => setIndex((current) => Math.max(0, current - 1))}><ArrowLeft size={16} /></button><button ref={nextRef} type="button" className="tour-primary" onClick={() => index === steps.length - 1 ? onClose() : setIndex((current) => Math.min(steps.length - 1, current + 1))}>{index === steps.length - 1 ? 'Explore' : 'Next'} <ArrowRight size={16} aria-hidden="true" /></button></footer></> : <div className="tour-invite-actions"><button ref={nextRef} type="button" className="tour-primary" onClick={onStart}>Take a quick tour <ArrowRight size={16} aria-hidden="true" /></button><button type="button" onClick={onClose}>Explore on my own</button><small>Optional · {steps.length} stops · move at your own pace</small></div>}
    </section>
  </dialog>;
}
