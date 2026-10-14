// Adapted from Aceternity UI's 3D Card (Manu Arora).
// https://ui.aceternity.com/components/3d-card-effect
// Spring response, touch and reduced-motion behavior tailored to this portfolio.
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

export function CardContainer({ children, className, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 160, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 160, damping: 24 });
  const reduce = useReducedMotion();
  const move = (event) => {
    if (reduce || event.pointerType !== 'mouse') return;
    const rect = ref.current.getBoundingClientRect();
    x.set(-(event.clientY - rect.top - rect.height / 2) / rect.height * 7);
    y.set((event.clientX - rect.left - rect.width / 2) / rect.width * 7);
  };
  return <div className="folio-tilt-perspective"><motion.div ref={ref} className={className} style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d' }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div></div>;
}
