import { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Aperture, Command, Globe, SlidersHorizontal } from 'lucide-react';
import { portfolioProjects, projectPath } from '../../data/portfolio-projects';

export default function WorkArchive() {
  const [active,setActive]=useState(0);
  const [view,setView]=useState('screen');
  const reduce=useReducedMotion();
  const select=(index)=>{setActive((index+portfolioProjects.length)%portfolioProjects.length);setView('screen');};
  const keyChange=(event,index)=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?portfolioProjects.length-1:(index+(event.key==='ArrowRight'?1:-1)+portfolioProjects.length)%portfolioProjects.length;
    select(next);document.getElementById(`exhibit-tab-${next}`)?.focus();
  };
  const parallax=(event)=>{
    if(reduce || event.pointerType!=='mouse')return;
    const rect=event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--stage-x',`${(event.clientX-rect.left-rect.width/2)/45}px`);
    event.currentTarget.style.setProperty('--stage-y',`${(event.clientY-rect.top-rect.height/2)/45}px`);
  };
  return <section className="folio-section folio-exhibit" id="selected-work">
    <div className="folio-section-label"><span>01</span><span>PROJECTS</span><span aria-hidden="true">↗</span></div>
    <div className="folio-exhibit-heading"><div><span className="folio-mono">FULL STACK &amp; FRONTEND</span><h2>Selected<br/><em>projects.</em></h2></div><p>Explore the features,<br/>implementation, and source code.<ArrowUpRight size={22} aria-hidden="true"/></p></div>
    <div className="folio-project-instrument">
      <header className="folio-instrument-header"><span className="folio-mono"><Aperture size={16}/> PROJECT PREVIEWS</span><div><i aria-hidden="true"/><span>PROJECT / 0{active+1}</span></div><span className="folio-instrument-corners" aria-hidden="true">AG—01</span></header>
      <div className="folio-exhibit-scene" onPointerMove={parallax} onPointerLeave={(event)=>{event.currentTarget.style.setProperty('--stage-x','0px');event.currentTarget.style.setProperty('--stage-y','0px');}}>
        <span className="folio-scene-word" aria-hidden="true">WORK.</span><div className="folio-scene-orbit" aria-hidden="true"/><div className="folio-scene-floor" aria-hidden="true"/>
        <div className="folio-exhibit-screens">{portfolioProjects.map((project,index)=>{
          const offset=((index-active+1+portfolioProjects.length)%portfolioProjects.length)-1;
          return <button key={project.id} type="button" className={`folio-exhibit-screen ${active===index?'is-selected':''}`} style={{zIndex:active===index?3:1,'--screen-accent':project.accent,transform:`translateX(${offset*72}%) translateY(${Math.abs(offset)*28}px) rotateY(${offset*-33}deg) rotateZ(${offset*5}deg) scale(${active===index?1:.72})`,opacity:active===index?1:.48}} onClick={()=>select(index)} aria-label={`Select ${project.name}`} aria-pressed={active===index} tabIndex={active===index?-1:0}>
            <span className="folio-exhibit-windowbar"><span aria-hidden="true"><i/><i/><i/></span><span>{project.links[0].href.replace('https://','').replace(/\/$/,'')}</span><Globe size={10} aria-hidden="true"/></span>
            <span className="folio-exhibit-image"><img src={project.image} srcSet={project.imageSet} sizes="(max-width:700px) 85vw, 55vw" alt={`${project.name} website interface`} width="960" height="600" loading="lazy" decoding="async"/>{active===index && view==='notes' && <span className="folio-exhibit-overlay"><span className="folio-mono"><SlidersHorizontal size={15}/> KEY FEATURES</span><strong>{project.name}</strong><span className="folio-exhibit-features">{project.features.map((feature,i)=><span key={feature}><small>0{i+1}</small>{feature}</span>)}</span></span>}</span>
            <span className="folio-exhibit-screen-foot"><span>{project.name}</span><span>0{index+1} <Command size={10}/></span></span>
          </button>;
        })}</div>
        <span className="folio-stage-coordinate" aria-hidden="true">DESIGN × ENGINEERING</span><span className="folio-stage-marker" aria-hidden="true">+<br/>+<br/>+</span>
      </div>
      <div className="folio-turntable-controls"><div className="folio-turntable-counter" aria-live="polite"><span>0{active+1}</span><small>/ 03<br/>PROJECTS</small></div><div className="folio-tuner"><button onClick={()=>select(active-1)} aria-label="Previous project"><ArrowLeft size={18}/></button><label className="folio-tuner-dial"><span className="folio-dial-marks" aria-hidden="true"/><span className="folio-dial-face" style={{rotate:`${-55+active*55}deg`}} aria-hidden="true"><i/></span><input type="range" min="0" max={portfolioProjects.length-1} step="1" value={active} onChange={(event)=>select(Number(event.target.value))} aria-label="Choose a project" aria-valuetext={portfolioProjects[active].name}/><span className="folio-sr-only">Drag left or right, or use arrow keys, to choose a project</span></label><button onClick={()=>select(active+1)} aria-label="Next project"><ArrowRight size={18}/></button><span className="folio-tuner-help">SLIDE TO SELECT</span></div><button className="folio-exhibit-view" aria-pressed={view==='notes'} onClick={()=>setView(view==='screen'?'notes':'screen')}><SlidersHorizontal size={15}/>{view==='screen'?'View features':'View screenshot'}</button></div>
      <div className="folio-exhibit-tabs" role="tablist" aria-label="Selected projects">{portfolioProjects.map((project,index)=><button key={project.id} id={`exhibit-tab-${index}`} role="tab" aria-selected={active===index} aria-controls={`exhibit-detail-${index}`} tabIndex={active===index?0:-1} onKeyDown={(event)=>keyChange(event,index)} onClick={()=>select(index)}><span>0{index+1}</span>{project.name}<ArrowUpRight size={14}/></button>)}</div>
    </div>
    <div className="folio-exhibit-details">{portfolioProjects.map((project,index)=><article key={project.id} id={`exhibit-detail-${index}`} role="tabpanel" aria-labelledby={`exhibit-tab-${index}`} hidden={active!==index}><div className="folio-exhibit-title"><span className="folio-mono">{project.category}</span><h3>{project.name}</h3><div className="folio-exhibit-links"><a href={projectPath(project)}>View case study<ArrowUpRight size={18}/></a>{project.links.map((link)=><a key={link.id} href={link.href} target="_blank" rel="noreferrer">{link.name==='GitHub'?'Source code':'Live site'}<ArrowUpRight size={14}/></a>)}</div></div><div className="folio-exhibit-description"><h4>{project.title}</h4><p>{project.description[0]}</p><div>{project.stack.map((tool)=><span key={tool}>{tool}</span>)}</div></div></article>)}</div>
    <nav className="folio-exhibit-index" aria-label="All project case studies"><span className="folio-mono">ALL CASE STUDIES</span>{portfolioProjects.map((project,index)=><a href={projectPath(project)} key={project.id}><span>0{index+1}</span>{project.name}<ArrowUpRight size={14}/></a>)}</nav>
  </section>;
}
