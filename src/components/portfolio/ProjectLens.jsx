import { useId, useState } from 'react';
import { MoveHorizontal, ScanLine } from 'lucide-react';

export default function ProjectLens({ project }) {
  const [position, setPosition] = useState(46);
  const id = useId();
  return <div className="folio-lens" style={{ '--lens': `${position}%` }}>
    <div className="folio-lens-image"><img src={project.image} srcSet={project.imageSet} sizes="(max-width:700px) 90vw, 1000px" width="1200" height="750" loading="lazy" alt={`${project.name} interface beneath its build overview`} /></div>
    <div className="folio-lens-blueprint" aria-hidden="true"><div className="folio-lens-grid" /><header><ScanLine size={18} /><span>BEHIND THE PIXELS</span><span>01—04</span></header><div className="folio-lens-circuit">{project.nodes.map((node,index)=><div key={node.label}><i /><span>0{index+1}</span><strong>{node.label}</strong><small>{node.caption}</small></div>)}</div><footer>{project.stack.join(' / ')}</footer></div>
    <div className="folio-lens-seam" aria-hidden="true"><span><MoveHorizontal size={19} /></span></div>
    <label className="folio-lens-label" htmlFor={id}>Drag to see behind the pixels <span>{position}%</span></label>
    <input id={id} type="range" min="0" max="100" value={position} onChange={(event)=>setPosition(Number(event.target.value))} aria-label={`Reveal ${project.name} build overview`} aria-valuetext={`${position}% build overview revealed`} />
    <div className="folio-sr-only">Build overview: {project.nodes.map((node)=>`${node.label}: ${node.detail}`).join(' ')}</div>
  </div>;
}
