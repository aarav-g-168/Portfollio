import { ArrowUpRight, BriefcaseBusiness, Compass, FileText, Folder, Trophy, X } from 'lucide-react';

const essentials = [
  ['finder', Folder, 'View my work', 'Projects & source code'],
  ['experience', BriefcaseBusiness, 'Experience & skills', 'Internship & leadership'],
  ['coding', Trophy, 'Competitive programming', 'Ratings & problem solving'],
  ['resume', FileText, 'Get my résumé', 'Read or download the PDF'],
];
export function StartHere({ onOpen, onExplore, onDismiss }) {
  return <aside className="start-here" aria-label="Start here">
    <div className="start-heading"><span><Compass size={16} aria-hidden="true" /> Start here</span><button type="button" aria-label="Dismiss Start here" title="Reopen from the Apple menu" onClick={onDismiss}><X size={15} /></button></div>
    <p>A quick way into my world.</p>
    <div className="start-actions">{essentials.map(([key, Icon, title, description]) => <button key={key} type="button" onClick={() => onOpen(key)}><Icon size={19} aria-hidden="true" /><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={13} aria-hidden="true" /></button>)}</div>
    <button type="button" className="explore-desktop" onClick={onExplore}>Take a guided tour <ArrowUpRight size={14} aria-hidden="true" /></button>
  </aside>;
}

