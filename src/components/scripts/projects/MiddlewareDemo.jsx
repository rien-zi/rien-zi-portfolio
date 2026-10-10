import { useState } from 'react';
export default function MiddlewareDemo() {
  const [eventId, setEventId] = useState('evt-1042');
  const [fail, setFail] = useState(false);
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const log = (message) => setLogs((previous) => [...previous.slice(-7), message]);
  const receive = () => {
    const id = eventId.trim();
    if (!id) return;
    if (events.some((event) => event.id === id)) { log(`${id}: duplicate delivery ignored by the idempotency check.`); return; }
    setEvents((previous) => [...previous, { id, status: 'queued', attempts: 0, fail }]);
    log(`${id}: received and queued. Incoming request acknowledged.`);
  };
  const process = () => {
    const event = events.find((item) => item.status !== 'done');
    if (!event) return;
    const failed = event.fail && event.attempts === 0;
    setEvents((previous) => previous.map((item) => item.id === event.id ? { ...item, attempts: item.attempts + 1, status: failed ? 'retry' : 'done' } : item));
    log(`${event.id}: ${failed ? 'simulated timeout; retained for retry.' : 'payload transformed, state saved and notification dispatched.'}`);
  };
  return <div className="project-demo" data-cubee-obstacle>
    <p className="demo-caption">Local queue simulation · no webhook or notification is sent</p>
    <div className="demo-form-row"><label>Event identity<input value={eventId} maxLength={32} onChange={(event) => setEventId(event.target.value)} /></label><label className="demo-checkbox"><input type="checkbox" checked={fail} onChange={(event) => setFail(event.target.checked)} /> Simulate a first-attempt timeout</label></div>
    <div className="demo-button-row"><button className="demo-primary" type="button" onClick={receive}>Receive webhook</button><button type="button" disabled={!events.some((event) => event.status !== 'done')} onClick={process}>Run / retry worker</button><button type="button" onClick={() => { setEvents([]); setLogs([]); }}>Reset queue</button></div>
    <p className="demo-hint">Receive the same identity twice to see deduplication. Give the next event a different identity to add a new task.</p>
    <div className="demo-event-list">{events.length ? events.map((event) => <div key={event.id}><code>{event.id}</code><span>{event.status}</span><span>{event.attempts} attempts</span></div>) : <p>Queue is empty.</p>}</div>
    <div className="demo-log" role="log" aria-label="Processing log">{logs.map((text, index) => <p key={`${index}-${text}`}>{text}</p>)}</div>
  </div>;
}
