import { useEffect, useRef } from 'react';
import { Archive, ArrowUpRight, BriefcaseBusiness, Compass, FileText, Folder, Image, Mail, Music2, NotebookPen, Search, Terminal, Trophy, X } from 'lucide-react';

const essentials = [
  ['finder', Folder, 'View my work', 'Projects & source code'],
  ['experience', BriefcaseBusiness, 'Experience & skills', 'Internship & leadership'],
  ['coding', Trophy, 'Competitive programming', 'Ratings & problem solving'],
  ['resume', FileText, 'Get my résumé', 'Read or download the PDF'],
];
const extras = [
  ['spotlight', Search, 'Spotlight', 'Find apps, projects and skills. Ctrl / ⌘ K.'],
  ['spotify', Music2, 'The music notch', 'Click the music icon at the top to see my latest listen.'],
  ['photos', Image, 'Gallery', 'Personal and social photos, plus your favorites.'],
  ['safari', NotebookPen, 'Build Notes', 'A closer look at how my projects came together.'],
  ['terminal', Terminal, 'Skills', 'Explore the tools and technologies I work with.'],
  ['trash', Archive, 'Archive', 'Browse and restore notes stored in this browser.'],
  ['contact', Mail, 'Say hello', 'Send me a message from the Contact app.'],
];

export function StartHere({ onOpen, onExplore, onDismiss }) {
  return <aside className="start-here" aria-label="Start here">
    <div className="start-heading"><span><Compass size={16} aria-hidden="true" /> Start here</span><button type="button" aria-label="Dismiss Start here" title="Reopen from the Apple menu" onClick={onDismiss}><X size={15} /></button></div>
    <p>A quick way into my world.</p>
    <div className="start-actions">{essentials.map(([key, Icon, title, description]) => <button key={key} type="button" onClick={() => onOpen(key)}><Icon size={19} aria-hidden="true" /><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={13} aria-hidden="true" /></button>)}</div>
    <button type="button" className="explore-desktop" onClick={onExplore}>Explore this desktop <ArrowUpRight size={14} aria-hidden="true" /></button>
  </aside>;
}

export default function PortfolioGuide({ onOpen, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  return <dialog ref={dialogRef} className="portfolio-guide" aria-labelledby="guide-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="guide-content">
      <header><span><Compass size={17} aria-hidden="true" /> Portfolio guide</span><button type="button" autoFocus aria-label="Close portfolio guide" onClick={onClose}><X size={18} /></button></header>
      <div className="guide-body"><h2 id="guide-title">Make yourself at home.</h2><p>Pick anything below to open it. The dock keeps your apps close, and the menu bar takes you straight to the essentials.</p>
        <h3>The essentials</h3><div className="guide-grid">{essentials.map(([key, Icon, title, description]) => <button key={key} type="button" onClick={() => onOpen(key)}><Icon size={21} aria-hidden="true" /><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={14} aria-hidden="true" /></button>)}</div>
        <h3>A little more to explore</h3><div className="guide-grid">{extras.map(([key, Icon, title, description]) => <button key={key} type="button" onClick={() => onOpen(key)}><Icon size={21} aria-hidden="true" /><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={14} aria-hidden="true" /></button>)}</div>
        <p className="guide-tip">Window controls: red closes, yellow minimizes to the dock, and green expands. Find this guide again in the Apple menu.</p>
      </div>
    </div>
  </dialog>;
}
