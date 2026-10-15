import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Code2, X, Plus, Minus, Send, Copy, Check, Command } from 'lucide-react';
import { experiences, socials } from '../constants';
import { contactEmail, submitContactMessage } from '../lib/contact';
import snapshot from '../data/coding-snapshot.json';
import Magnet from './portfolio/vendor/Magnet';
import { CardContainer } from './portfolio/ProjectTilt';
import DesktopPortal from './portfolio/DesktopPortal';
import { portfolioProjects, projectPath } from '../data/portfolio-projects';
import ProjectLens from './portfolio/ProjectLens';
import SkillPatchboard from './portfolio/SkillPatchboard';
import InteractionField from './portfolio/InteractionField';
import ProjectCollection from './portfolio/ProjectCollection';
import BuildProcess from './portfolio/BuildProcess';
import SectionNavigation from './portfolio/SectionNavigation';
import usePortfolioSeo from './portfolio/usePortfolioSeo';
import useHydrated from './portfolio/useHydrated';
import './BasicPortfolio.css';

const projects = portfolioProjects;
const reveal = { initial: false, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.55 } };

function SectionLabel({ number, children }) {
  return <div className="folio-section-label"><span>{number}</span><span>{children}</span><span aria-hidden="true">↗</span></div>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus(); };
  }, []);
  const info = project.children.find((child) => child.fileType === 'txt');
  return <dialog className="folio-dialog" ref={ref} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="project-detail-title">
    <div className="folio-dialog-inner"><header><span className="folio-mono">PROJECT NOTES / {project.category}</span><button onClick={onClose} aria-label="Close project details"><X /></button></header>
      <h2 id="project-detail-title">{project.name}</h2><p className="folio-dialog-lead">{info.description[0]}</p><h3>Inside the build</h3><ul>{info.description.slice(1).map((text) => <li key={text}>{text}</li>)}</ul>
      <div className="folio-links">{project.children.filter((child) => child.fileType === 'url').map((link) => <a key={link.id} href={link.href} target="_blank" rel="noreferrer">{link.name === 'GitHub' ? 'View source' : 'Visit website'} <ArrowUpRight size={17} /></a>)}</div>
    </div>
  </dialog>;
}

function ProjectShowcase() {
  const enhanced=useHydrated();
  const [selected, setSelected] = useState(0);
  const [view, setView] = useState('preview');
  const [details, setDetails] = useState(null);
  const project = projects[selected];
  const meta = project;
  const image = { imageUrl: project.image };
  const summary = project.children.find((item) => item.fileType === 'txt');
  const links = project.children.filter((item) => item.fileType === 'url');
  const tabKey = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? projects.length - 1 : (selected + (event.key === 'ArrowRight' ? 1 : -1) + projects.length) % projects.length;
    setSelected(next); document.getElementById(`project-tab-${next}`)?.focus();
  };
  return <section className="folio-section folio-work" id="selected-work"><SectionLabel number="01">SELECTED WORK</SectionLabel>
    <motion.div {...reveal} className="folio-section-title"><h2>Less talk.<br /><em>More shipped.</em></h2><p>Real problems. Real builds.<br />A few things I’ve helped bring to life.</p></motion.div>
    <div className="folio-project-tabs" role="tablist" aria-label="Select project">{projects.map((item, index) => <button key={item.id} role="tab" id={`project-tab-${index}`} aria-selected={selected === index} aria-controls="project-panel" tabIndex={selected === index ? 0 : -1} onKeyDown={tabKey} onClick={() => { setSelected(index); setView('preview'); }}><span>0{index + 1}</span>{item.name}<ArrowUpRight size={17} /></button>)}</div>
    <div role="tabpanel" id="project-panel" aria-labelledby={`project-tab-${selected}`} className="folio-project-panel">
      <CardContainer className="folio-project-visual" style={{ '--project-accent': meta.accent }}><div className="folio-visual-top"><span>{meta.category}</span><div className="folio-visual-switch" role="group" aria-label="Project visualization"><button aria-pressed={view==='preview'} onClick={() => setView('preview')}>Preview</button><button aria-pressed={view==='map'} onClick={() => setView('map')}>X-ray</button></div></div>
        <div className="folio-project-stage">{view==='map' ? <ProjectLens key={project.id} project={project} /> : <AnimatePresence mode="wait"><motion.div key={project.id} initial={enhanced ? { opacity: 0, y: 18, rotate: -2 } : false} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="folio-browser"><div className="folio-browser-bar"><i /><i /><i /><span>{links[0].href.replace('https://', '').replace(/\/$/, '')}</span></div><img src={image.imageUrl} alt={`${project.name} website preview`} srcSet={project.imageSet} sizes="(max-width:700px) 90vw, 1000px" width="1200" height="750" loading="lazy" decoding="async" /></motion.div></AnimatePresence>}</div>
        <span className="folio-visual-caption">BUILT TO BE USED. MADE TO FEEL GOOD.</span><button className="folio-visual-open" aria-label={`Read about ${project.name}`} onClick={() => setDetails(project)}><ArrowUpRight size={26} /></button>
      </CardContainer>
      <div className="folio-project-copy"><div><span className="folio-mono">THE BUILD / 0{selected + 1}</span><h3>{meta.title}</h3><p>{summary.description[0]}</p><div className="folio-tags">{meta.stack.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="folio-project-actions"><button onClick={() => setDetails(project)}>Inside the build <Plus size={18} /></button>{links.map((link) => <a key={link.id} href={link.href} target="_blank" rel="noreferrer">{link.name === 'GitHub' ? <><Code2 size={16} /> Source</> : <>Live site <ArrowUpRight size={18} /></>}</a>)}</div></div>
    </div><div className="folio-build-highlights">{project.features.map((feature,index) => <div key={feature}><span className="folio-mono">0{index+1}</span><p>{feature}</p><ArrowUpRight size={16} aria-hidden="true" /></div>)}</div><a className="folio-full-story" href={projectPath(project)}>Read the full project story <ArrowUpRight size={17} /></a><ProjectCollection />{details && <ProjectDialog project={details} onClose={() => setDetails(null)} />}
  </section>;
}

function Journey() {
  const [expanded, setExpanded] = useState(experiences[0].id);
  return <section className="folio-section" id="journey"><SectionLabel number="02">THE HUMAN BEHIND THE CODE</SectionLabel><div className="folio-about"><motion.div {...reveal}><h2>Curious by default.<br /><em>Builder by choice.</em></h2><p>I’m Aarav, a full stack developer at VIT Vellore. I work across interfaces, APIs, and databases—and enjoy the details that make them feel like one thing.</p><a className="folio-text-link" href="/resume" target="_blank" rel="noreferrer">The résumé version <ArrowUpRight size={18} /></a></motion.div><motion.div {...reveal} className="folio-portrait"><img src="/preview/aarav-640.webp" alt="Aarav Gupta at an event" width="300" height="340" loading="lazy" /><span>OFF THE KEYBOARD / ON THE GROUND</span><div className="folio-portrait-stamp" aria-hidden="true">AG<br /><span>ALWAYS BUILDING</span></div></motion.div></div>
    <div className="folio-journey"><div className="folio-journey-trace" aria-hidden="true"><motion.span animate={{scaleY:expanded===experiences[0].id ? .5 : expanded ? 1 : 0}} transition={{duration:.4}} /></div>{experiences.map((entry, index) => <article key={entry.id} className={expanded === entry.id ? 'is-expanded' : ''}><button className="folio-journey-trigger" aria-expanded={expanded === entry.id} aria-controls={`role-${index}`} onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}><span className="folio-mono">0{index + 1} / {entry.type}</span><span><strong>{entry.organization}</strong><small>{entry.role}</small></span><span className="folio-role-date">{entry.dates}</span>{expanded === entry.id ? <Minus size={22} /> : <Plus size={22} />}</button><div id={`role-${index}`} hidden={expanded !== entry.id} className="folio-journey-body"><p className="folio-mono">{entry.location}</p><ul>{entry.highlights.map((text) => <li key={text}>{text}</li>)}</ul><div className="folio-tags">{entry.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></article>)}</div>
  </section>;
}

function Toolbench() {
  return <section className="folio-section" id="toolbench"><SectionLabel number="04">UNDER THE HOOD</SectionLabel><motion.div {...reveal} className="folio-section-title"><h2>A creative eye.<br /><em>An engineering brain.</em></h2><p>The tools change.<br />The urge to figure things out doesn’t.</p></motion.div><div className="folio-tool-grid"><SkillPatchboard /><div className="folio-coding"><span className="folio-mono">A DIFFERENT KIND OF PLAY</span><h3>Think. Solve.<br />Repeat.</h3><p>Algorithms, contests, and the occasional stubborn problem.</p>{['codechef', 'codeforces', 'leetcode'].map((platform, index) => <a key={platform} href={snapshot[platform].url} target="_blank" rel="noreferrer"><span className="folio-mono">0{index + 1}</span><span>{['CodeChef', 'Codeforces', 'LeetCode'][index]}</span><ArrowUpRight size={19} /></a>)}<small>Open a profile for current ratings and activity.</small></div></div><BuildProcess /></section>;
}

function Contact() {
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null), pending = useRef(false);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const submit = async (event) => {
    event.preventDefault(); const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    if (fields._honey || pending.current) return;
    if (!fields.name.trim() || fields.message.trim().length < 10) { setFeedback('Please enter your name and a message of at least 10 characters.'); return; }
    pending.current = true; setSending(true); setFeedback('');
    try { await submitContactMessage({ ...fields, name: fields.name.trim(), email: fields.email.trim(), message: fields.message.trim() }); setFeedback('Message submitted. Thanks for saying hello!'); form.reset(); }
    catch (error) { setFeedback(error.message); }
    finally { pending.current = false; setSending(false); }
  };
  const copy = async () => { try { await navigator.clipboard.writeText(contactEmail); setCopied(true); clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopied(false), 2000); } catch { setFeedback('Copy unavailable. You can select the email address or use the email link.'); } };
  return <section className="folio-contact" id="connect"><div className="folio-section"><SectionLabel number="05">GOOD THINGS START WITH A HELLO</SectionLabel><div className="folio-contact-grid"><div><motion.h2 {...reveal}>Let’s make<br /><em>something</em><br />worth clicking.<ArrowUpRight aria-hidden="true" /></motion.h2><p>An opportunity, an idea, or a particularly good question.<br />My inbox is open.</p><div className="folio-email"><a href={`mailto:${contactEmail}`}>{contactEmail}</a><button onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email address'}>{copied ? <Check size={18} /> : <Copy size={18} />}</button><span role="status" className="folio-sr-only">{copied ? 'Email copied' : ''}</span></div><div className="folio-socials">{socials.slice(0, 3).map((social) => <a key={social.id} href={social.link} target="_blank" rel="noreferrer">{social.text}<ArrowUpRight size={15} /></a>)}</div></div><form className="folio-postcard" onSubmit={submit} aria-label="Send Aarav a message"><div className="folio-postcard-top"><span className="folio-mono">A NOTE, STRAIGHT TO MY INBOX</span><span className="folio-postcard-stamp" aria-hidden="true"><Send size={22}/><small>HELLO / AG</small></span></div><label>Your name <span>*</span><input name="name" required autoComplete="name" maxLength={100} placeholder="What should I call you?" /></label><label>Email address <span>*</span><input name="email" type="email" required autoComplete="email" maxLength={254} placeholder="you@company.com" /></label><label>What’s on your mind? <span>*</span><textarea name="message" required minLength={10} maxLength={5000} rows={3} placeholder="Tell me a little about it…" /></label><input name="subject" type="hidden" value="Portfolio enquiry" /><div className="folio-honey" aria-hidden="true"><input name="_honey" tabIndex={-1} autoComplete="off" /></div><button className={`folio-send ${sending ? "is-sending" : ""}`} disabled={sending} type="submit">{sending ? 'Sending your note…' : 'Send a little hello'}<Send size={18} /></button><p role="status" className="folio-form-feedback">{feedback}</p></form></div><footer className="folio-footer"><a href="#intro" aria-label="Back to top">ag<span>© {new Date().getFullYear()} Aarav Gupta</span></a><span>BUILT WITH INTENT. AND A LITTLE PLAY.</span><a href="#intro">BACK TO TOP <ArrowUpRight size={16} /></a></footer></div></section>;
}

export default function BasicPortfolio() {
  const scrollRef = useRef(null), restored = useRef(false);
  const reduce = useReducedMotion();
  const [animateIntro] = useState(() => typeof document !== 'undefined' && document.getElementById('root')?.dataset.prerendered !== 'true');
  usePortfolioSeo();
  useEffect(() => {
    if (restored.current) return; restored.current = true;
    try { const saved = sessionStorage.getItem('portfolio-scroll'); if (saved !== null) { scrollRef.current.scrollTop = Number(saved); sessionStorage.removeItem('portfolio-scroll'); } } catch { /* Optional navigation memory. */ }
  }, []);
  return <MotionConfig reducedMotion="user"><main className="folio" ref={scrollRef}><a className="folio-skip" href="#selected-work">Skip to projects</a>
    <header className="folio-header"><a className="folio-brand" href="#intro">ag<span>AARAV GUPTA<br /><small>DEVELOPER & CURIOUS HUMAN</small></span></a><nav aria-label="Portfolio navigation"><a href="#selected-work">Work<span>01</span></a><a href="#journey">About<span>02</span></a><a href="#connect">Contact<span>05</span></a><a href="/resume" target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={15} /></a></nav><a href="#connect" className="folio-header-hello">Say hello <ArrowUpRight size={17} /></a></header>
    <section id="intro" className="folio-hero"><div className="folio-hero-top"><span className="folio-mono"><span className="folio-status-dot" /> FULL STACK DEVELOPER</span><span className="folio-mono">BASED IN INDIA ↗ BUILDING FOR THE WEB</span></div><div className="folio-hero-stage"><div className="folio-hero-type"><h1 aria-label="Aarav Gupta, full stack developer. Serious about play."><span className="folio-sr-only">Aarav Gupta — Full Stack Developer</span>{['SERIOUS', 'ABOUT', 'PLAY.'].map((word, index) => <span className={`folio-title-line line-${index}`} key={word} aria-hidden="true"><motion.span initial={reduce || !animateIntro ? false : { y: '110%', rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.85, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}>{word}</motion.span></span>)}</h1><div className="folio-hero-annotation"><span aria-hidden="true">↳</span>Good engineering.<br />A little unexpected.</div></div><div className="folio-hero-object" aria-hidden="true" onPointerMove={(event)=>{ if(reduce || event.pointerType!=="mouse") return; const box=event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--hero-x",`${(event.clientX-box.left-box.width/2)/18}px`); event.currentTarget.style.setProperty("--hero-y",`${(event.clientY-box.top-box.height/2)/18}px`); }} onPointerLeave={(event)=>{event.currentTarget.style.setProperty("--hero-x","0px");event.currentTarget.style.setProperty("--hero-y","0px");}}><div className="folio-object-grid" /><div className="folio-orbit orbit-one" /><div className="folio-orbit orbit-two" /><motion.div className="folio-orange-object" ><svg viewBox="0 0 300 300"><defs><linearGradient id="object-face" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffb18b" /><stop offset=".5" stopColor="#ff5b21" /><stop offset="1" stopColor="#b52e0a" /></linearGradient></defs><path d="M150 12 184 83 261 58 236 136 298 175 217 194 219 275 150 231 83 287 82 204 5 181 67 132 39 58 117 82Z" fill="url(#object-face)" stroke="#ff8757" strokeWidth="2" /><path d="m150 12 0 219M39 58l178 136M5 181l231-45M83 287l101-204M261 58 82 204" fill="none" stroke="#ffa375" strokeOpacity=".55" /><circle cx="150" cy="150" r="44" fill="#eb4415" stroke="#ffac79" /><path d="m139 139-12 11 12 11m22-22 12 11-12 11m-9-27-8 33" fill="none" stroke="#ffdabf" strokeWidth="4" strokeLinecap="round" /></svg></motion.div><span className="folio-object-coordinate">CRAFT / CODE / CURIOSITY</span><span className="folio-object-index">FIG. 01</span><motion.span className="folio-floating-chip chip-one" drag={!reduce} dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }} dragSnapToOrigin><Command size={14} /> a little extra.</motion.span><span className="folio-floating-chip chip-two"><Code2 size={15} /> ideas, made tangible.</span></div></div><div className="folio-hero-bottom"><p>I’m Aarav. I build full stack experiences<br />with a thing for <strong>the little details.</strong></p><Magnet disabled={reduce} padding={30} magnetStrength={6} maxOffset={10}><a className="folio-primary" href="#selected-work">Explore the work <ArrowDown size={20} /></a></Magnet><a className="folio-hero-scroll" href="#selected-work"><span>SCROLL TO DISCOVER</span><ArrowDown size={17} /></a></div></section>
    <div className="folio-ticker" aria-hidden="true"><span>THOUGHTFULLY ENGINEERED</span><i>✳</i><span>PLAYFULLY CRAFTED</span><i>✳</i><span>BUILT FOR THE WEB</span><i>✳</i><span>THOUGHTFULLY ENGINEERED</span><i>✳</i></div>
    <InteractionField scrollRef={scrollRef} /><SectionNavigation scrollRef={scrollRef} /><ProjectShowcase /><Journey /><DesktopPortal scrollRef={scrollRef} /><Toolbench /><Contact />
  </main></MotionConfig>;
}
