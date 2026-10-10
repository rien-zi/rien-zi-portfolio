import { useState } from 'react';
const documents = [
  { id: 'DOC-01', group: 'integration', title: 'Example integration playbook', text: 'Retry failed webhook events after a transient timeout. An idempotency key identifies repeat deliveries so the same event does not dispatch its notification twice.' },
  { id: 'DOC-02', group: 'operations', title: 'Example resolution guide', text: 'A customer query should be classified, matched with relevant context and reviewed before a response is approved. Record the decision and its supporting evidence.' },
  { id: 'DOC-03', group: 'operations', title: 'Example campaign checklist', text: 'Review the campaign content and HTML preview. Send a test email to reviewers, apply revisions, then confirm the audience, priority and schedule.' },
];
const terms = (text) => text.toLowerCase().match(/[a-z]{3,}/g)?.filter((word) => !['the', 'how', 'what', 'does', 'should', 'with', 'for', 'and', 'can', 'are', 'why'].includes(word)) ?? [];
export default function RagDemo() {
  const [query, setQuery] = useState('How do we retry failed webhook events?');
  const [filter, setFilter] = useState('all');
  const [result, setResult] = useState(null);
  const [openSource, setOpenSource] = useState(null);
  const search = (event) => {
    event.preventDefault();
    const keywords = terms(query);
    const matches = documents.filter((doc) => filter === 'all' || doc.group === filter).map((doc) => ({ ...doc, score: keywords.reduce((score, term) => score + (doc.text.toLowerCase().includes(term) ? 1 : 0), 0) })).filter((doc) => doc.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
    setResult(matches); setOpenSource(matches[0]?.id ?? null);
  };
  return <div className="project-demo" data-cubee-obstacle>
    <p className="demo-caption">Local retrieval illustration · fictional documents</p>
    <p className="demo-hint">This small demo uses keyword matching to show context and citations. The production project uses hybrid / vector retrieval and an AI API.</p>
    <form onSubmit={search}><div className="demo-form-row"><label>Ask about the example documents<input value={query} maxLength={200} onChange={(event) => setQuery(event.target.value)} required /></label><label>Metadata filter<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All documents</option><option value="integration">Integration</option><option value="operations">Operations</option></select></label></div><button className="demo-primary" type="submit">Retrieve context ↗</button></form>
    <div className="demo-button-row">{['How do we retry failed webhook events?', 'How is a customer query reviewed?', 'What should a campaign preview include?'].map((text) => <button key={text} type="button" onClick={() => setQuery(text)}>{text}</button>)}</div>
    {result && <div className="demo-retrieval" role="status"><h3>Retrieved context</h3>{result.length ? result.map((doc) => <article key={doc.id}><p>{doc.text}</p><button type="button" onClick={() => setOpenSource(doc.id)}>{doc.id} · {doc.title} ↗</button></article>) : <p>No supporting context in this example corpus. Try another question or remove the filter.</p>}</div>}
    <details open={Boolean(openSource)}><summary>Inspect the source documents</summary>{documents.filter((doc) => !openSource || doc.id === openSource).map((doc) => <article className="demo-source" key={doc.id}><h4>{doc.id} / {doc.title}</h4><p>{doc.text}</p><small>Metadata: {doc.group}</small></article>)}</details>
  </div>;
}
