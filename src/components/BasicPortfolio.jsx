import { useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Code2, Send, Copy, Check, Smartphone } from 'lucide-react';
import { socials } from '../constants';
import { contactEmail, submitContactMessage } from '../lib/contact';
import snapshot from '../data/coding-snapshot.json';
import Magnet from './portfolio/vendor/Magnet';
import DesktopPortal from './portfolio/DesktopPortal';
import SkillPatchboard from './portfolio/SkillPatchboard';
import InteractionField from './portfolio/InteractionField';
import BuildProcess from './portfolio/BuildProcess';
import SectionNavigation from './portfolio/SectionNavigation';
import usePortfolioSeo from './portfolio/usePortfolioSeo';
import usePortfolioScroll from './portfolio/usePortfolioScroll';
import WorkArchive from './portfolio/WorkArchive';
import ExperienceLedger from './portfolio/ExperienceLedger';
import './BasicPortfolio.css';
import './portfolio/WorkExperience.css';

const reveal = { initial: false, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.55 } };

function SectionLabel({ number, children }) {
  return <div className="folio-section-label"><span>{number}</span><span>{children}</span><span aria-hidden="true">↗</span></div>;
}

function Journey() {
  return <section className="folio-section folio-team-section" id="journey"><SectionLabel number="02">EXPERIENCE</SectionLabel><div className="folio-team-heading"><h2>Internship &amp;<br /><em>leadership.</em></h2><div><img src="/preview/aarav-640.webp" alt="Aarav Gupta" width="64" height="64" loading="lazy"/><p>Alongside my studies at VIT Vellore, I contribute to product development at Solder Labs and web development at ADG.</p></div></div><ExperienceLedger /></section>;
}

function Toolbench() {
  return <section className="folio-section" id="toolbench"><SectionLabel number="04">SKILLS</SectionLabel><motion.div {...reveal} className="folio-section-title"><h2>Technical<br /><em>skills.</em></h2><p>Languages, frameworks, and tools<br />I use across my projects.</p></motion.div><div className="folio-tool-grid"><SkillPatchboard /><div className="folio-coding"><span className="folio-mono">COMPETITIVE PROGRAMMING</span><h3>Data structures<br />&amp; algorithms.</h3><p>I practise problem solving and participate in programming contests on CodeChef, Codeforces, and LeetCode.</p>{['codechef', 'codeforces', 'leetcode'].map((platform, index) => <a key={platform} href={snapshot[platform].url} target="_blank" rel="noreferrer"><span className="folio-mono">0{index + 1}</span><span>{['CodeChef', 'Codeforces', 'LeetCode'][index]}</span><ArrowUpRight size={19} /></a>)}<small>Open a profile for current ratings and activity.</small></div></div><BuildProcess /></section>;
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
    try { await submitContactMessage({ ...fields, name: fields.name.trim(), email: fields.email.trim(), message: fields.message.trim() }); setFeedback('Your message has been submitted. Thank you for getting in touch.'); form.reset(); }
    catch (error) { setFeedback(error.message); }
    finally { pending.current = false; setSending(false); }
  };
  const copy = async () => { try { await navigator.clipboard.writeText(contactEmail); setCopied(true); clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopied(false), 2000); } catch { setFeedback('Copy unavailable. You can select the email address or use the email link.'); } };
  return <section className="folio-contact" id="connect"><div className="folio-section"><SectionLabel number="05">CONTACT</SectionLabel><div className="folio-contact-grid"><div><motion.h2 {...reveal}>Let’s<br /><em>connect.</em><ArrowUpRight aria-hidden="true" /></motion.h2><p>Have a role, project, or collaboration in mind?<br />Send a message or contact me by email.</p><div className="folio-email"><a href={`mailto:${contactEmail}`}>{contactEmail}</a><button onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email address'}>{copied ? <Check size={18} /> : <Copy size={18} />}</button><span role="status" className="folio-sr-only">{copied ? 'Email copied' : ''}</span></div><div className="folio-socials">{socials.slice(0, 3).map((social) => <a key={social.id} href={social.link} target="_blank" rel="noreferrer">{social.text === 'Github' ? 'GitHub' : social.text}<ArrowUpRight size={15} /></a>)}</div></div><form className="folio-postcard" onSubmit={submit} aria-label="Send Aarav a message"><div className="folio-postcard-top"><span className="folio-mono">CONTACT FORM</span><span className="folio-postcard-stamp" aria-hidden="true"><Send size={22}/><small>AG / CONTACT</small></span></div><label>Your name <span>*</span><input name="name" required autoComplete="name" maxLength={100} placeholder="Your full name" /></label><label>Email address <span>*</span><input name="email" type="email" required autoComplete="email" maxLength={254} placeholder="you@company.com" /></label><label>Message <span>*</span><textarea name="message" required minLength={10} maxLength={5000} rows={3} placeholder="Tell me about the role, project, or enquiry." /></label><input name="subject" type="hidden" value="Portfolio enquiry" /><div className="folio-honey" aria-hidden="true"><input name="_honey" tabIndex={-1} autoComplete="off" /></div><button className={`folio-send ${sending ? "is-sending" : ""}`} disabled={sending} type="submit">{sending ? 'Sending…' : 'Send message'}<Send size={18} /></button><p role="status" className="folio-form-feedback">{feedback}</p></form></div><footer className="folio-footer"><a href="#intro" aria-label="Back to top">ag<span>© {new Date().getFullYear()} Aarav Gupta</span></a><span>AARAV GUPTA / FULL STACK DEVELOPER</span><a href="#intro">BACK TO TOP <ArrowUpRight size={16} /></a></footer></div></section>;
}

export default function BasicPortfolio() {
  const { scrollRef, contentRef } = usePortfolioScroll({ restoreKey: 'portfolio-scroll' });
  const reduce = useReducedMotion();
  const [animateIntro] = useState(() => typeof document !== 'undefined' && document.getElementById('root')?.dataset.prerendered !== 'true');
  usePortfolioSeo();
  return <MotionConfig reducedMotion="user"><main className="folio" ref={scrollRef}><div className="folio-scroll-content" ref={contentRef}><a className="folio-skip" href="#selected-work">Skip to projects</a>
    <header className="folio-header"><a className="folio-brand" href="#intro">ag<span>AARAV GUPTA<br /><small>PORTFOLIO</small></span></a><nav aria-label="Portfolio navigation"><a href="#selected-work">Projects<span>01</span></a><a href="#journey">Experience<span>02</span></a><a href="#connect">Contact<span>05</span></a><a href="/resume" target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={15} /></a></nav><a href="#connect" className="folio-header-hello">Contact me <ArrowUpRight size={17} /></a></header>
    <section id="intro" className="folio-hero"><div className="folio-hero-top"><span className="folio-mono"><span className="folio-status-dot" /> FULL STACK DEVELOPER</span><span className="folio-mono">VIT VELLORE / INDIA</span></div><div className="folio-hero-stage"><div className="folio-hero-type"><h1 aria-label="Aarav Gupta — Full Stack Developer"><span className="folio-sr-only">Aarav Gupta — Full Stack Developer</span>{['AARAV', 'GUPTA.'].map((word, index) => <span className={`folio-title-line line-${index}`} key={word} aria-hidden="true"><motion.span initial={reduce || !animateIntro ? false : { y: '110%', rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.85, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}>{word}</motion.span></span>)}</h1></div><div className="folio-hero-object" aria-hidden="true" onPointerMove={(event)=>{ if(reduce || event.pointerType!=="mouse") return; const box=event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--hero-x",`${(event.clientX-box.left-box.width/2)/18}px`); event.currentTarget.style.setProperty("--hero-y",`${(event.clientY-box.top-box.height/2)/18}px`); }} onPointerLeave={(event)=>{event.currentTarget.style.setProperty("--hero-x","0px");event.currentTarget.style.setProperty("--hero-y","0px");}}><div className="folio-object-grid" /><div className="folio-orbit orbit-one" /><div className="folio-orbit orbit-two" /><motion.div className="folio-orange-object" ><svg viewBox="0 0 300 300"><defs><linearGradient id="object-face" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffb18b" /><stop offset=".5" stopColor="#ff5b21" /><stop offset="1" stopColor="#b52e0a" /></linearGradient></defs><path d="M150 12 184 83 261 58 236 136 298 175 217 194 219 275 150 231 83 287 82 204 5 181 67 132 39 58 117 82Z" fill="url(#object-face)" stroke="#ff8757" strokeWidth="2" /><path d="m150 12 0 219M39 58l178 136M5 181l231-45M83 287l101-204M261 58 82 204" fill="none" stroke="#ffa375" strokeOpacity=".55" /><circle cx="150" cy="150" r="44" fill="#eb4415" stroke="#ffac79" /><path d="m139 139-12 11 12 11m22-22 12 11-12 11m-9-27-8 33" fill="none" stroke="#ffdabf" strokeWidth="4" strokeLinecap="round" /></svg></motion.div><span className="folio-object-index">FIG. 01</span><motion.span className="folio-floating-chip chip-one" drag={!reduce} dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }} dragSnapToOrigin><Smartphone size={14} /> React Native</motion.span><span className="folio-floating-chip chip-two"><Code2 size={15} /> Java · C++ · Python</span></div></div><div className="folio-hero-bottom"><p>I build web and mobile applications, from the interface<br />to the <strong>APIs and data behind it.</strong></p><Magnet disabled={reduce} padding={30} magnetStrength={6} maxOffset={10}><a className="folio-primary" href="#selected-work">View projects <ArrowDown size={20} /></a></Magnet><a className="folio-hero-scroll" href="#selected-work"><span>SCROLL TO PROJECTS</span><ArrowDown size={17} /></a></div></section>
    <div className="folio-ticker" aria-hidden="true"><span>TYPESCRIPT</span><i>✳</i><span>NODE.JS</span><i>✳</i><span>MONGODB</span><i>✳</i><span>FIREBASE</span><i>✳</i><span>GIT</span><i>✳</i></div>
    <InteractionField scrollRef={scrollRef} /><SectionNavigation scrollRef={scrollRef} /><WorkArchive /><Journey /><DesktopPortal scrollRef={scrollRef} /><Toolbench /><Contact />
  </div></main></MotionConfig>;
}
