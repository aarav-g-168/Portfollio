import { useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Users, MapPin } from 'lucide-react';
import { experiences } from '../../constants';

export default function ExperienceLedger() {
  const [active,setActive]=useState(0);
  const change=(event)=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?experiences.length-1:(active+1)%experiences.length;
    setActive(next);document.getElementById(`ledger-tab-${next}`)?.focus();
  };
  return <div className="folio-ledger"><div className="folio-ledger-top"><span className="folio-mono">EXPERIENCE / FIELD NOTES</span><span className="folio-mono">TWO CHAPTERS. STILL WRITING.</span></div><div className="folio-ledger-tabs" role="tablist" aria-label="Experience chapters">{experiences.map((item,index)=><button key={item.id} id={`ledger-tab-${index}`} role="tab" aria-selected={active===index} aria-controls={`ledger-page-${index}`} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={change}>{index===0?<BriefcaseBusiness size={17}/>:<Users size={17}/>} {item.type}<span>0{index+1}</span></button>)}</div>
    <div className="folio-ledger-spread"><aside><div className="folio-ledger-chapter"><span className="folio-mono">THE CHAPTERS</span>{experiences.map((item,index)=><button key={item.id} onClick={()=>setActive(index)} aria-pressed={active===index}><span>0{index+1}</span><span><strong>{item.organization}</strong><small>{item.role}</small></span><ArrowUpRight size={15}/></button>)}</div><div className="folio-ledger-margin"><span className="folio-ledger-scribble">Learning by<br/>building things.</span><span className="folio-mono">REAL TEAMS.<br/>REAL RESPONSIBILITY.</span></div><a className="folio-ledger-resume" href="/resume" target="_blank" rel="noreferrer">The résumé version<ArrowUpRight size={16}/></a></aside><div className="folio-ledger-binding" aria-hidden="true">{Array.from({length:7},(_,i)=><i key={i}/>)}</div>
      <div className="folio-ledger-paper">{experiences.map((entry,index)=><div className="folio-ledger-page" key={entry.id} role="tabpanel" id={`ledger-page-${index}`} aria-labelledby={`ledger-tab-${index}`} hidden={active!==index}><header><span className="folio-ledger-category">{entry.type}</span><span className="folio-mono">{entry.dates}</span></header><h3>{entry.organization}</h3><p className="folio-ledger-role">{entry.role}</p><span className="folio-ledger-location"><MapPin size={13}/>{entry.location}</span><div className="folio-ledger-highlights">{entry.highlights.map((text,index)=><div key={text}><span>0{index+1}</span><p>{text}</p></div>)}</div><div className="folio-ledger-tools"><span className="folio-mono">TOOLS ON THE DESK</span><div>{entry.skills.map((skill)=><span key={skill}>{skill}</span>)}</div></div></div>)}<footer><span className="folio-mono">AARAV GUPTA / WORK IN PROGRESS</span><span>0{active+1}</span></footer></div></div>
  </div>;
}
