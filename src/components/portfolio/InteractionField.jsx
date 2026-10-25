import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

// One delegated pointer listener, no React render loop and no replacement cursor.
export default function InteractionField({ scrollRef }) {
  const ref=useRef(null);
  const x=useMotionValue(-100),y=useMotionValue(-100);
  const sx=useSpring(x,{stiffness:500,damping:38}),sy=useSpring(y,{stiffness:500,damping:38});
  const reduce=useReducedMotion();
  useEffect(()=>{
    if(reduce || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const root=scrollRef.current;
    const move=(event)=>{
      x.set(Math.min(event.clientX+18,innerWidth-170));y.set(Math.min(event.clientY+18,innerHeight-40));
      const target=event.target.closest('[data-cursor]');
      if(ref.current){ref.current.dataset.visible=target?'true':'false';ref.current.textContent=target?.dataset.cursor || '';}
    };
    const hide=()=>{if(ref.current)ref.current.dataset.visible='false';};
    root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerleave',hide);
    return()=>{root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',hide);};
  },[scrollRef,reduce,x,y]);
  return <motion.div ref={ref} className="folio-pointer-note" style={{x:sx,y:sy}} aria-hidden="true"/>;
}
