import { ArrowUpRight } from 'lucide-react';
import { portfolioProjects, projectPath } from '../../data/portfolio-projects';

// Pointer spotlight treatment inspired by React Bits SpotlightCard.
// https://reactbits.dev/components/spotlight-card
export default function ProjectCollection() {
  const illuminate = (event) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x',`${event.clientX-rect.left}px`);
    event.currentTarget.style.setProperty('--spot-y',`${event.clientY-rect.top}px`);
  };
  return <div className="folio-collection"><div className="folio-collection-heading"><span className="folio-mono">THE PROJECT INDEX</span><p>Go a little deeper.</p></div><div className="folio-collection-grid">{portfolioProjects.map((project,index) => <article className="folio-collection-card" key={project.id} onPointerMove={illuminate} style={{'--card-accent':project.accent}}><a className="folio-collection-link" href={projectPath(project)} aria-label={`Explore ${project.name}`}><div className="folio-collection-image"><img src={project.image} srcSet={project.imageSet} sizes="(max-width:700px) 90vw, 30vw" alt={`${project.name} interface`} width="960" height="600" loading="lazy" decoding="async" /><span className="folio-collection-circle"><ArrowUpRight size={24} /></span></div><div className="folio-collection-card-copy"><span className="folio-mono">0{index+1} / {project.category}</span><h3>{project.name}</h3><p>{project.brief}</p><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><span className="folio-collection-read">Explore the build <ArrowUpRight size={16} /></span></div></a></article>)}</div></div>;
}
