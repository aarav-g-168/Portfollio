import { useState } from 'react';
import { ArrowUpRight, Aperture } from 'lucide-react';
import { portfolioProjects, projectPath } from '../../data/portfolio-projects';

export default function ProjectCollection() {
  const [active,setActive] = useState(0);
  return <div className="folio-reel"><header><span className="folio-mono"><Aperture size={15} /> THE DIRECTOR’S CUT</span><p>Three builds. Different worlds.</p><span className="folio-reel-counter">0{active+1}<small> / 03</small></span></header>
    <div className="folio-reel-track">{portfolioProjects.map((project,index)=><article key={project.id} className={`folio-reel-panel ${active===index?'is-active':''}`} style={{'--reel-accent':project.accent}}>
      <button className="folio-reel-selector" aria-expanded={active===index} aria-controls={`reel-${project.slug}`} onClick={()=>setActive(index)}><span>0{index+1}</span><strong>{project.name}</strong><span className="folio-reel-plus" aria-hidden="true">{active===index?'−':'+'}</span></button>
      <div className="folio-reel-screen" id={`reel-${project.slug}`}><img src={project.image} srcSet={project.imageSet} sizes="(max-width:700px) 90vw, 65vw" width="960" height="600" loading="lazy" decoding="async" alt={`${project.name} interface`} /><div className="folio-reel-scan" aria-hidden="true" /><span className="folio-reel-frame" aria-hidden="true">FRAME / 0{index+1}</span><div className="folio-reel-caption"><span className="folio-mono">{project.category}</span><h3>{project.name}</h3><p>{project.brief}</p><a data-cursor="OPEN THE STORY" href={projectPath(project)} aria-label={`Explore ${project.name}`}>Explore the build <ArrowUpRight size={19}/></a></div></div>
    </article>)}</div><footer><span className="folio-mono">SELECT A TITLE TO CHANGE THE FRAME</span><span aria-hidden="true">▪ ▪ ▪ ━━━━━━━━━ ▪ ▪ ▪</span></footer></div>;
}
