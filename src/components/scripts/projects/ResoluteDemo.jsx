import { useState } from 'react';
const scenarios = {
  query: { label: 'Customer query', context: 'A sample customer asks for an update on an unresolved request.', steps: ['Receive the query', 'Classify the intent', 'Retrieve relevant context', 'Review the proposed response', 'Record the resolution'], outcome: 'Response approved and the resolution recorded in this example workflow.' },
  alert: { label: 'Repeated alert', context: 'Two sample alerts refer to the same operational event.', steps: ['Receive the alerts', 'Match event identity', 'Suppress the duplicate', 'Review the relevant alert', 'Dispatch one actionable event'], outcome: 'One actionable event remains; the repeated alert is suppressed.' },
  claim: { label: 'Claim review', context: 'A sample claim requires evidence and an agent decision.', steps: ['Receive the claim', 'Gather supporting data', 'Apply deterministic checks', 'Request human review', 'Record the reviewed decision'], outcome: 'The reviewed decision is recorded with its supporting context.' },
};
export default function ResoluteDemo() {
  const [scenario, setScenario] = useState('query');
  const [step, setStep] = useState(0);
  const selected = scenarios[scenario];
  const done = step === selected.steps.length;
  return <div className="project-demo" data-cubee-obstacle>
    <p className="demo-caption">Illustrative local workflow · fictional cases</p>
    <div className="demo-button-row">{Object.entries(scenarios).map(([id, item]) => <button type="button" key={id} aria-pressed={scenario === id} onClick={() => { setScenario(id); setStep(0); }}>{item.label}</button>)}</div>
    <p>{selected.context}</p>
    <ol className="demo-workflow">{selected.steps.map((text, index) => <li key={text} data-state={index < step ? 'complete' : index === step ? 'current' : 'waiting'}><span>{index < step ? '✓' : index + 1}</span>{text}</li>)}</ol>
    <div className="demo-button-row"><button className="demo-primary" type="button" disabled={done} onClick={() => setStep((current) => current + 1)}>{step === 3 ? 'Approve this sample decision' : 'Run the next step'} ↗</button><button type="button" onClick={() => setStep(0)}>Reset</button></div>
    <p className="demo-feedback" role="status">{done ? selected.outcome : `Current stage: ${selected.steps[step]}.`}</p>
  </div>;
}
