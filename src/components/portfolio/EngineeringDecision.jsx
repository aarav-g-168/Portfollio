export default function EngineeringDecision({ decision }) {
  const details = [
    ['Problem', decision.problem],
    ['Decision', decision.implementation],
    ['Trade-off', decision.tradeOff],
  ];

  return <section className="folio-case-decisions" aria-labelledby="engineering-decisions-title">
    <span className="folio-mono">IMPLEMENTATION</span>
    <h2 id="engineering-decisions-title">Engineering decisions.</h2>
    <p className="folio-decision-context">{decision.title}</p>
    <dl className="folio-decision-grid">
      {details.map(([label, text], index) => <div key={label}>
        <dt><span aria-hidden="true">0{index + 1}</span>{label}</dt>
        <dd>{text}</dd>
      </div>)}
    </dl>
  </section>;
}
