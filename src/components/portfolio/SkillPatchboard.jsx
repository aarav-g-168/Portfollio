import { useState } from 'react';
import { Cable, ArrowUpRight } from 'lucide-react';
import { portfolioSkills } from '../../data/portfolio-skills';

export default function SkillPatchboard() {
  const [active, setActive] = useState(1);
  const patchHeight = portfolioSkills.length * 50;
  const socketY = 25 + active * 50;
  const outputY = patchHeight / 2;

  return <div className="folio-patchboard" style={{ '--patch-height': `${patchHeight}px` }}>
    <header><Cable size={20}/><span className="folio-mono">TECHNICAL SKILLS</span><span className="folio-patch-light" aria-hidden="true"/></header>
    <div className="folio-patch-layout">
      <div className="folio-patch-inputs" aria-label="Skill categories">
        {portfolioSkills.map((group, index) => <button key={group.category} id={`skill-category-${index}`}
          aria-pressed={active === index} aria-controls={`skill-panel-${index}`} onClick={() => setActive(index)}>
          <span className="folio-patch-socket" aria-hidden="true"/><span>{group.category}</span><small>0{index + 1}</small>
        </button>)}
      </div>
      <div className="folio-patch-wire" aria-hidden="true">
        <svg viewBox={`0 0 100 ${patchHeight}`} preserveAspectRatio="none">
          <path d={`M 0 ${socketY} C 80 ${socketY}, 10 ${outputY}, 100 ${outputY}`} />
          <circle cx="98" cy={outputY} r="3"/>
        </svg>
      </div>
      {portfolioSkills.map((group, groupIndex) => <div className="folio-patch-output" key={group.category}
        id={`skill-panel-${groupIndex}`} role="region" aria-labelledby={`skill-category-${groupIndex}`} hidden={active !== groupIndex}>
        <div className="folio-patch-readout"><span className="folio-mono">CATEGORY</span><strong>{group.category}</strong></div>
        <div className="folio-patch-tools" aria-live="polite">
          {group.items.map((item, index) => <div key={item} style={{ '--tool-order': index }}>
            <span className="folio-patch-tool-led" aria-hidden="true"/><span>{item}</span><small>{String(index + 1).padStart(2, '0')}</small>
          </div>)}
        </div>
        <div className="folio-patch-status"><span className="folio-patch-light" aria-hidden="true"/>{group.items.length} skills in this category<ArrowUpRight size={13}/></div>
      </div>)}
    </div>
    <footer><span>SELECT A CATEGORY TO VIEW SKILLS.</span><span aria-hidden="true">AG—04</span></footer></div>;
}
