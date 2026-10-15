import { useState } from 'react';
import { Cable, ArrowUpRight } from 'lucide-react';
import { techStack } from '../../constants';

export default function SkillPatchboard() {
  const [active,setActive] = useState(1);
  const group=techStack[active];
  return <div className="folio-patchboard"><header><Cable size={20}/><span className="folio-mono">THE STACK / PATCH BAY</span><span className="folio-patch-light" aria-hidden="true"/></header><div className="folio-patch-layout"><div className="folio-patch-inputs" aria-label="Skill categories">{techStack.map((item,index)=><button key={item.category} aria-pressed={active===index} onClick={()=>setActive(index)}><span className="folio-patch-socket" aria-hidden="true"/><span>{item.category}</span><small>0{index+1}</small></button>)}</div><div className="folio-patch-wire" aria-hidden="true"><svg viewBox="0 0 100 300" preserveAspectRatio="none"><path d={`M 0 ${25+active*50} C 80 ${25+active*50}, 10 150, 100 150`} /><circle cx="98" cy="150" r="3"/></svg></div><div className="folio-patch-output"><div className="folio-patch-readout"><span className="folio-mono">CONNECTED TO</span><strong>{group.category}</strong></div><div className="folio-patch-tools" key={active} aria-live="polite">{group.items.map((item,index)=><div key={item} style={{'--tool-order':index}}><span className="folio-patch-tool-led" aria-hidden="true"/><span>{item}</span><small>{String(index+1).padStart(2,'0')}</small></div>)}</div><div className="folio-patch-status"><span className="folio-patch-light" aria-hidden="true"/>{group.items.length} tools in this channel<ArrowUpRight size={13}/></div></div></div><footer><span>SWITCH A CHANNEL. EXPLORE THE TOOLKIT.</span><span aria-hidden="true">AG—04</span></footer></div>;
}
