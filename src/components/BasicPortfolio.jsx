import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Download, Mail, Monitor } from 'lucide-react';
import { experiences, locations, socials, techStack } from '../constants';
import { contactEmail, submitContactMessage } from '../lib/contact';
import './BasicPortfolio.css';

export default function BasicPortfolio() {
  const scrollRef = useRef(null);
  const restoredRef = useRef(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  useEffect(() => {
    document.title = 'Aarav Gupta — Full Stack Developer';
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const saved = sessionStorage.getItem('portfolio-scroll');
      if (saved !== null) scrollRef.current.scrollTop = Number(saved);
      sessionStorage.removeItem('portfolio-scroll');
    } catch { /* Optional scroll memory. */ }
  }, []);
  const enterDesktop = () => {
    try { sessionStorage.setItem('portfolio-scroll', String(scrollRef.current.scrollTop)); } catch { /* Navigation still works. */ }
  };
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    if (fields._honey || sending) return;
    if (!fields.name.trim() || fields.message.trim().length < 10) { setFeedback('Please enter your name and a message of at least 10 characters.'); return; }
    setSending(true); setFeedback('');
    try { await submitContactMessage({ ...fields, name: fields.name.trim(), email: fields.email.trim(), message: fields.message.trim() }); setFeedback('Message submitted. Thanks for getting in touch!'); form.reset(); }
    catch (error) { setFeedback(error.message); }
    finally { setSending(false); }
  };
  return <main className="basic-portfolio" ref={scrollRef}>
    <a className="basic-skip" href="#selected-work">Skip to projects</a>
    <header className="basic-header"><a href="#intro" className="basic-brand">Aarav Gupta<span>Full Stack Developer</span></a><nav aria-label="Portfolio navigation"><a href="#selected-work">Projects</a><a href="#journey">Experience</a><a href="#connect">Contact</a><a href="/resume" target="_blank" rel="noopener noreferrer">Résumé <ArrowUpRight size={13} /></a></nav></header>
    <section id="intro" className="basic-intro basic-section"><div><span className="basic-eyebrow">HELLO, I’M AARAV</span><h1>Building useful things<br />for the web.</h1><p>I’m a full stack developer working with React, Next.js, TypeScript, and the tools behind them. I enjoy turning ideas into applications people can actually use.</p><div className="basic-actions"><a className="basic-button primary" href="#selected-work">View projects <ArrowDown size={16} /></a><a className="basic-button" href="/resume" target="_blank" rel="noopener noreferrer">Read my résumé <ArrowUpRight size={16} /></a></div></div><img src="/images/aarav.jpeg" alt="Aarav Gupta" width="280" height="320" /></section>
    <section id="selected-work" className="basic-section"><div className="basic-section-heading"><div><span className="basic-eyebrow">SELECTED WORK</span><h2>Projects</h2></div><p>A few things I’ve helped bring to life.</p></div><div className="basic-project-grid">{locations.work.children.map((project, index) => {
      const summary = project.children.find((item) => item.fileType === 'txt');
      const image = project.children.find((item) => item.fileType === 'img');
      const links = project.children.filter((item) => item.fileType === 'url');
      return <article className="basic-project" key={project.id}><img src={image.imageUrl} alt={`${project.name} preview`} loading="lazy" width="640" height="400" /><div><span className="basic-eyebrow">0{index + 1}</span><h3>{project.name}</h3><p>{summary.description[0]}</p><div className="basic-project-links">{links.map((link) => <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer">{link.name === 'GitHub' ? 'Source code' : 'Visit website'} <ArrowUpRight size={15} /></a>)}</div></div></article>;
    })}</div></section>
    <section id="journey" className="basic-section"><span className="basic-eyebrow">MY JOURNEY</span><h2>Experience</h2><div className="basic-experiences">{experiences.map((entry) => <article key={entry.id}><div><span className="basic-eyebrow">{entry.type}</span><h3>{entry.organization}</h3><p>{entry.dates} · {entry.location}</p></div><div><h4>{entry.role}</h4><ul>{entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul><div className="basic-tags">{entry.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></article>)}</div></section>
    <section id="skills" className="basic-section"><span className="basic-eyebrow">TOOLS & PRACTICE</span><h2>Skills & problem solving</h2><div className="basic-skills">{techStack.map((group) => <article key={group.category}><h3>{group.category}</h3><p>{group.items.join(' · ')}</p></article>)}</div><div className="basic-coding"><h3>Competitive programming</h3><p>Contest profiles and problem-solving practice.</p><div className="basic-project-links"><a href="https://www.codechef.com/users/aaravgupta1608" target="_blank" rel="noopener noreferrer">CodeChef <ArrowUpRight size={15} /></a><a href="https://codeforces.com/profile/aarav_g_168" target="_blank" rel="noopener noreferrer">Codeforces <ArrowUpRight size={15} /></a><a href="https://leetcode.com/u/aarav_g_168/" target="_blank" rel="noopener noreferrer">LeetCode <ArrowUpRight size={15} /></a></div></div></section>
    <section id="desktop-preview" className="basic-section basic-desktop"><div><span className="basic-eyebrow">A DIFFERENT WAY TO EXPLORE</span><h2>Welcome to my desktop.</h2><p>Projects, music, photos, and a few small surprises inside an interactive macOS-inspired portfolio. Explore at your own pace.</p><a className="basic-button primary" href="/desktop" onClick={enterDesktop}>Enter MacFolio <Monitor size={16} /></a><small>You can return to this portfolio at any time.</small></div><a href="/desktop" onClick={enterDesktop} className="basic-laptop" aria-label="Enter MacFolio desktop"><div className="basic-laptop-screen"><div className="basic-laptop-menubar"><span>Aarav’s MacFolio</span><span>Projects · Experience</span></div><strong>Portfolio</strong><span className="basic-laptop-enter">Enter my desktop <ArrowUpRight size={13} /></span><div className="basic-laptop-dock" aria-hidden="true">{['finder.png','build-notes.svg','photos.png','contact.png','terminal.png'].map((image) => <img key={image} src={`/images/${image}`} alt="" />)}</div></div><div className="basic-laptop-base" /></a></section>
    <section id="connect" className="basic-section basic-contact"><div><span className="basic-eyebrow">GET IN TOUCH</span><h2>Let’s make something useful.</h2><p>Have an opportunity, a project, or a question? I’d love to hear from you.</p><a className="basic-email" href={`mailto:${contactEmail}`}><Mail size={17} />{contactEmail}</a><div className="basic-project-links">{socials.map((social) => <a key={social.id} href={social.link} target="_blank" rel="noopener noreferrer">{social.text} <ArrowUpRight size={14} /></a>)}</div><a className="basic-button" href="/resume.pdf" download>Download résumé <Download size={16} /></a></div><form onSubmit={submit}><label>Your name<input name="name" required autoComplete="name" maxLength={100} /></label><label>Email address<input name="email" type="email" required autoComplete="email" maxLength={254} /></label><input name="subject" type="hidden" value="Portfolio enquiry" /><div className="basic-honey" aria-hidden="true"><input name="_honey" tabIndex={-1} autoComplete="off" /></div><label>Message<textarea name="message" required minLength={10} maxLength={5000} rows={5} /></label><button className="basic-button primary" disabled={sending} type="submit">{sending ? 'Sending…' : 'Send message'} <ArrowUpRight size={16} /></button>{feedback && <p role="status" className="basic-feedback">{feedback}</p>}</form></section>
    <footer className="basic-footer"><span>© {new Date().getFullYear()} Aarav Gupta</span><a href="#intro">Back to top ↑</a></footer>
  </main>;
}
