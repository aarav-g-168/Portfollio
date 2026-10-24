import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Layers3 } from 'lucide-react';
import useHydrated from './useHydrated';

export default function ProjectMap({ project }) {
  const [active, setActive] = useState(0);
  const enhanced=useHydrated();
  return <div className="folio-system-map"><header><span className="folio-mono">{project.id === 6 ? 'USER FLOW' : 'APPLICATION STRUCTURE'}</span><Layers3 size={18} /></header>
    <div className="folio-system-nodes">{project.nodes.map((node,index) => <div key={node.label} className="folio-node-wrap"><button aria-pressed={active === index} onClick={() => setActive(index)} aria-describedby="system-map-detail"><span className="folio-mono">0{index+1}</span><strong>{node.label}</strong><small>{node.caption}</small></button>{index<project.nodes.length-1 && <ArrowRight className="folio-node-arrow" size={20} aria-hidden="true" />}</div>)}</div>
    <div id="system-map-detail" className="folio-system-detail" aria-live="polite"><AnimatePresence mode="wait"><motion.p key={active} initial={enhanced ? {opacity:0,y:6} : false} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.18}}>{project.nodes[active].detail}</motion.p></AnimatePresence></div><footer className="folio-mono">SELECT A STEP TO VIEW IMPLEMENTATION DETAILS.</footer>
  </div>;
}
