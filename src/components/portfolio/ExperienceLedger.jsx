import { useRef, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import { ArrowUpRight, MapPin, MoveUpRight, Grip, CornerDownRight } from 'lucide-react';
import { portfolioExperiences as experiences } from '../../data/portfolio-experience';

const dragQuery='(hover:hover) and (pointer:fine) and (min-width:900px)';
const subscribe=(callback)=>{const query=matchMedia(dragQuery);query.addEventListener('change',callback);return()=>query.removeEventListener('change',callback);};
const snapshot=()=>matchMedia(dragQuery).matches;
const serverSnapshot=()=>false;

function PassStock({entry,index}) {
  return <span className="folio-pass-stock"><span className="folio-pass-slot" aria-hidden="true"/><span className="folio-pass-type">{entry.type}<i aria-hidden="true"/></span><span className="folio-pass-wordmark" aria-hidden="true">{index===0?<>Solder<br/>Labs<span>FULL STACK / INTERNSHIP</span></>:<>ADG<span>WEB DEVELOPMENT / VIT</span></>}</span><span className="folio-pass-person"><strong>Aarav Gupta</strong><span>{entry.role}</span></span><span className="folio-pass-bottom"><span>{entry.dates}</span><MoveUpRight size={16} aria-hidden="true"/></span></span>;
}

function StaticPass({entry,index,active,onSelect}) {
  return <><svg className="folio-pass-rope" viewBox="0 0 220 430" aria-hidden="true"><defs><linearGradient id={`strap-${index}`} gradientUnits="userSpaceOnUse" x1="102" y1="0" x2="118" y2="0"><stop stopColor={index===0?'#b83714':'#59694c'}/><stop offset=".5" stopColor={index===0?'#f37f43':'#a8b491'}/><stop offset="1" stopColor={index===0?'#9c3214':'#3d4b33'}/></linearGradient></defs><path d="M110 8 C110 62 110 90 110 139" fill="none" stroke={`url(#strap-${index})`} strokeWidth="13" strokeLinecap="round"/><path d="M110 8 C110 62 110 90 110 139" fill="none" stroke="#f5d7ad70" strokeWidth="1" strokeDasharray="2 4"/><circle cx="110" cy="9" r="7" fill="#dadbca" stroke="#7a806d"/><circle cx="110" cy="9" r="2" fill="#5f6655"/></svg><button id={`role-pass-${index}`} className="folio-role-pass" onClick={onSelect} aria-pressed={active} aria-controls={`role-story-${index}`} aria-label={`View ${entry.type.toLowerCase()} at ${entry.organization}`}><PassStock entry={entry} index={index}/></button></>;
}

function DraggablePass({entry,index,active,onSelect}) {
  const x=useMotionValue(0),y=useMotionValue(0);
  const rope=useTransform([x,y],([dx,dy])=>`M110 8 C110 62 ${110+dx} ${90+dy} ${110+dx} ${139+dy}`);
  const tilt=useTransform(x,[-40,40],[-8,8]);
  const dragged=useRef(false);
  return <>
    <svg className="folio-pass-rope" viewBox="0 0 220 430" aria-hidden="true"><defs><linearGradient id={`strap-${index}`} gradientUnits="userSpaceOnUse" x1="102" y1="0" x2="118" y2="0"><stop stopColor={index===0?'#b83714':'#59694c'}/><stop offset=".5" stopColor={index===0?'#f37f43':'#a8b491'}/><stop offset="1" stopColor={index===0?'#9c3214':'#3d4b33'}/></linearGradient></defs><motion.path d={rope} fill="none" stroke={`url(#strap-${index})`} strokeWidth="13" strokeLinecap="round"/><motion.path d={rope} fill="none" stroke="#f5d7ad70" strokeWidth="1" strokeDasharray="2 4"/><circle cx="110" cy="9" r="7" fill="#dadbca" stroke="#7a806d"/><circle cx="110" cy="9" r="2" fill="#5f6655"/></svg>
    <motion.button id={`role-pass-${index}`} className="folio-role-pass is-draggable" style={{x,y,rotate:tilt}} drag dragConstraints={{left:-38,right:38,top:-20,bottom:45}} dragElastic={.12} dragSnapToOrigin dragTransition={{bounceStiffness:440,bounceDamping:22}} onPointerDown={()=>{dragged.current=false;}} onDragStart={()=>{dragged.current=true;}} onClick={(event)=>{if(event.detail===0 || !dragged.current)onSelect();}} aria-pressed={active} aria-controls={`role-story-${index}`} aria-label={`View ${entry.type.toLowerCase()} at ${entry.organization}`}>
      <PassStock entry={entry} index={index}/>
    </motion.button>
  </>;
}

function RolePass({entry,index,active,onSelect,canDrag}) {
  const Pass=canDrag?DraggablePass:StaticPass;
  return <div className={`folio-role-rig ${active?'is-active':''}`}><Pass entry={entry} index={index} active={active} onSelect={onSelect}/><span className="folio-rig-caption"><span>0{index+1}</span>{entry.type}</span></div>;
}

export default function ExperienceLedger() {
  const [active,setActive]=useState(0);
  const fine=useSyncExternalStore(subscribe,snapshot,serverSnapshot);
  const reduce=useReducedMotion();
  const canDrag=fine&&!reduce;
  return <div className="folio-credentials"><div className="folio-credentials-stage"><div className="folio-credential-rail" aria-hidden="true"><i/><span>INTERNSHIP &amp; LEADERSHIP</span><i/></div><div className="folio-role-passes" role="group" aria-label="Choose an experience">{experiences.map((entry,index)=><RolePass key={entry.id} entry={entry} index={index} active={active===index} onSelect={()=>setActive(index)} canDrag={canDrag}/>)}</div><p className="folio-pass-hint"><Grip size={14} aria-hidden="true"/>{canDrag?'Click a role for details. Cards can also be dragged.':'Select a role to view responsibilities.'}</p><span className="folio-credential-annotation" aria-hidden="true">Industry &amp;<br/>student leadership.<CornerDownRight size={27}/></span></div>
      <div className="folio-role-stories">{experiences.map((entry,index)=><article key={entry.id} id={`role-story-${index}`} aria-labelledby={`role-pass-${index}`} hidden={active!==index} className="folio-role-story"><header><span className="folio-mono">0{index+1} / {entry.type}</span><span className="folio-role-current"><i aria-hidden="true"/>ONGOING</span></header><h3>{entry.organization}</h3><p className="folio-role-position">{entry.role}</p><div className="folio-role-meta"><span>{entry.dates}</span><span><MapPin size={12} aria-hidden="true"/>{entry.location}</span></div><div className="folio-role-work">{entry.highlights.map((text,i)=><div key={text}><span>0{i+1}</span><p>{text}</p></div>)}</div><div className="folio-role-tools"><span className="folio-mono">TECHNOLOGIES USED</span><div>{entry.skills.map((skill)=><span key={skill}>{skill}</span>)}</div></div><a href="/resume" target="_blank" rel="noreferrer">View résumé<ArrowUpRight size={16}/></a></article>)}</div>
    </div>;
}
