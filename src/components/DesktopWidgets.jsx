import { useEffect, useRef } from 'react';
import { ArrowUpRight, FileText, Globe2, Mail, X } from 'lucide-react';

export default function DesktopWidgets({ now, onClose, onOpen }) {
  const ref = useRef(null);
  const first = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const india = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }).format(now);
  useEffect(() => {
    const pointer = (event) => { if (!ref.current?.contains(event.target) && !event.target.closest('.date-trigger')) onClose(); };
    const key = (event) => { if (event.key === 'Escape') { onClose(); document.querySelector('.date-trigger')?.focus(); } };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', key); };
  }, [onClose]);
  return <section ref={ref} id="desktop-widgets" className="desktop-widgets" aria-label="Date and widgets">
    <header><span>Your desktop, at a glance</span><button type="button" aria-label="Close widgets" onClick={onClose}><X size={17} /></button></header>
    <div className="widget-pair">
      <article className="desktop-widget clock-widget"><span>LOCAL TIME</span><strong>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</strong><p>{now.toLocaleDateString([], { weekday: 'long' })}</p><small>{now.toLocaleDateString([], { day: 'numeric', month: 'long' })}</small></article>
      <article className="desktop-widget calendar-widget" aria-label={now.toLocaleDateString([], { month: 'long', year: 'numeric' })}><h2>{now.toLocaleDateString([], { month: 'long' })} <span>{now.getFullYear()}</span></h2><div className="calendar-grid" aria-hidden="true">{['S','M','T','W','T','F','S'].map((day,i) => <b key={`day-${i}`}>{day}</b>)}{Array.from({ length: first }, (_,i) => <span key={`blank-${i}`} />)}{Array.from({ length: days }, (_,i) => <span key={i} className={i + 1 === now.getDate() ? 'today' : ''}>{i + 1}</span>)}</div><span className="sr-only">Today is {now.toLocaleDateString([], { dateStyle: 'full' })}</span></article>
    </div>
    <article className="desktop-widget timezone-widget"><div><Globe2 size={20} aria-hidden="true" /><span><strong>Aarav’s time</strong><small>India · IST · UTC +5:30</small></span></div><b>{india}</b><p>A handy reference when getting in touch.</p></article>
    <article className="desktop-widget widget-connect"><span className="widget-eyebrow">LET’S BUILD SOMETHING</span><h2>A conversation starts here.</h2><p>Have a role, a project, or an idea in mind?</p><button type="button" onClick={() => onOpen('contact')}><Mail size={17} aria-hidden="true" /> Write to Aarav <ArrowUpRight size={15} aria-hidden="true" /></button></article>
    <button type="button" className="desktop-widget widget-resume" onClick={() => onOpen('resume')}><FileText size={24} aria-hidden="true" /><span><strong>The short version</strong><small>Open my résumé · PDF</small></span><ArrowUpRight size={17} aria-hidden="true" /></button>
    <p className="widget-footnote">A little context. No notifications to catch up on.</p>
  </section>;
}
