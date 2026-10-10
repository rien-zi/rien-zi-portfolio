import { useState } from 'react';
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
function checkIntent(text) {
  if (/\b(passwords?|otp|credit card|private customer data)\b/i.test(text)) return 'This example request asks for sensitive credentials or private data. Use content that does not collect or disclose it.';
  if (/\b(harass|humiliate|insult|hate speech)\b/i.test(text)) return 'This example request suggests harmful targeting. Rewrite it as respectful, acceptable communication.';
  if (/<\s*(script|iframe|form)|\bon\w+\s*=|javascript:/i.test(text)) return 'Active scripts, embedded forms and executable handlers are not accepted in this email preview.';
  return null;
}
function template(title, copy, vibe, color, image) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /></head><body style="margin:0;background:#ecece8;font-family:Arial,sans-serif;color:#202a3d"><table role="presentation" style="width:100%;max-width:580px;margin:24px auto;background:#fff;border-collapse:collapse"><tr><td style="padding:28px">${image ? `<img src="${window.location.origin}/campaign-preview.svg" alt="Ideas meet the inbox" style="width:100%;height:auto" />` : ''}<p style="font-size:11px;letter-spacing:2px;color:${color}">${escape(vibe.toUpperCase())}</p><h1 style="font-size:28px;line-height:1.2">${escape(title)}</h1><p style="font-size:16px;line-height:1.7;white-space:pre-line">${escape(copy)}</p><span style="display:inline-block;padding:12px 20px;background:${color};color:#fff;border-radius:5px">Explore the update</span><p style="margin-top:32px;font-size:11px;color:#687083">Illustrative campaign preview · rien-zi portfolio</p></td></tr></table></body></html>`;
}
export default function CampaignDemo() {
  const [title, setTitle] = useState('Something useful is coming');
  const [copy, setCopy] = useState('We’re introducing a simpler way to discover our latest updates. Take a look at what’s new and find something worth your time.');
  const [vibe, setVibe] = useState('Warm and confident');
  const [color, setColor] = useState('#315cff');
  const [image, setImage] = useState(true);
  const [html, setHtml] = useState('');
  const [dirty, setDirty] = useState(false);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [audience, setAudience] = useState('Product update subscribers');
  const [priority, setPriority] = useState('normal');
  const [schedule, setSchedule] = useState('');
  const [email, setEmail] = useState('reviewer@example.com');
  const [tested, setTested] = useState(false);
  const [approved, setApproved] = useState(false);
  const [saved, setSaved] = useState(null);
  const invalidate = () => { setTested(false); setApproved(false); setSaved(null); };
  const generate = (nextCopy = copy, nextVibe = vibe, nextColor = color) => {
    const block = checkIntent(`${title} ${nextCopy} ${nextVibe}`);
    setReason(block ?? ''); invalidate();
    if (block) { setHtml(''); setFeedback('The example intent check blocked this brief.'); return; }
    setHtml(template(title, nextCopy, nextVibe, nextColor, image)); setDirty(false);
    setFeedback('A local template is ready to review.');
  };
  const revise = (kind) => {
    const nextCopy = kind === 'shorter' ? copy.split(/[.!?]/)[0] + '.' : copy;
    const nextVibe = kind === 'warmer' ? 'Friendly and welcoming' : vibe;
    const nextColor = kind === 'blue' ? '#315cff' : color;
    setCopy(nextCopy); setVibe(nextVibe); setColor(nextColor); generate(nextCopy, nextVibe, nextColor);
  };
  const htmlBlock = html ? checkIntent(html) : null;
  const test = (event) => { event.preventDefault(); setTested(true); setApproved(false); setFeedback(`Local preview check prepared for ${email}. This portfolio demo does not send email.`); };
  return <div className="project-demo campaign-demo" data-cubee-obstacle>
    <p className="demo-caption">Local walkthrough · preset design logic · no live AI, image upload or email delivery</p>
    <p className="demo-hint">Explore the real tool’s brief → design → revision → preview → confirmation workflow. These sample intent checks illustrate a gate; they are not a production security policy.</p>
    <div className="demo-form-row"><label>Campaign title<input value={title} maxLength={100} onChange={(event) => { setTitle(event.target.value); setDirty(true); invalidate(); }} /></label><label>Vibe<input value={vibe} maxLength={80} onChange={(event) => { setVibe(event.target.value); setDirty(true); invalidate(); }} /></label></div>
    <label className="demo-full-label">What should the campaign communicate?<textarea value={copy} maxLength={1200} rows={3} onChange={(event) => { setCopy(event.target.value); setDirty(true); invalidate(); }} /></label>
    <div className="demo-form-row"><label>Accent<select value={color} onChange={(event) => { setColor(event.target.value); setDirty(true); invalidate(); }}><option value="#315cff">Cobalt</option><option value="#b93145">Rose</option><option value="#247565">Forest</option></select></label><label className="demo-checkbox"><input type="checkbox" checked={image} onChange={(event) => { setImage(event.target.checked); setDirty(true); invalidate(); }} /> Include the bundled sample image</label></div>
    <div className="demo-button-row"><button className="demo-primary" type="button" onClick={() => generate()}>Design a local template ↗</button><button type="button" onClick={() => { setCopy('Ask recipients to share their password.'); setHtml(''); invalidate(); setFeedback('An intentionally blocked example. Run the intent check to see the reason.'); }}>Try a blocked brief</button></div>
    {reason && <p className="demo-blocked" role="alert">{reason}</p>}
    {dirty && html && <p className="demo-hint" role="status">Your brief changed. Regenerate the template or manually update the HTML before reviewing this draft.</p>}
    {html && <>
      <div className="demo-button-row"><button type="button" onClick={() => revise('shorter')}>Follow-up: shorter copy</button><button type="button" onClick={() => revise('warmer')}>Follow-up: warmer tone</button><button type="button" onClick={() => revise('blue')}>Follow-up: blue layout</button></div>
      <p className="demo-hint">Production assets use ImageKit over S3-backed storage. This preview uses a bundled local SVG.</p>
      <iframe className="campaign-preview" title="Local campaign HTML preview" sandbox="" referrerPolicy="no-referrer" srcDoc={htmlBlock ? '<p>This HTML was blocked. Remove the unsafe content before previewing.</p>' : html} />
      <details><summary>Manually tweak the HTML</summary><textarea aria-label="Campaign HTML" rows={9} value={html} maxLength={12000} onChange={(event) => { setHtml(event.target.value); setDirty(false); invalidate(); }} /></details>
      {htmlBlock && <p className="demo-blocked" role="alert">{htmlBlock}</p>}
      <form onSubmit={test}><div className="demo-form-row"><label>Reviewer email<input type="email" value={email} required onChange={(event) => { setEmail(event.target.value); invalidate(); }} /></label><button type="submit" disabled={dirty || Boolean(htmlBlock)}>Check test preview</button></div></form>
      <div className="demo-form-row"><label>Audience<input value={audience} maxLength={100} onChange={(event) => { setAudience(event.target.value); setSaved(null); }} /></label><label>Priority<select value={priority} onChange={(event) => { setPriority(event.target.value); setSaved(null); }}><option value="normal">Normal</option><option value="high">High</option></select></label><label>Schedule<input type="datetime-local" value={schedule} onChange={(event) => { setSchedule(event.target.value); setSaved(null); }} /></label></div>
      <label className="demo-checkbox"><input type="checkbox" disabled={dirty || !tested || Boolean(htmlBlock)} checked={approved} onChange={(event) => setApproved(event.target.checked)} /> I reviewed the local test preview and approve this draft</label>
      <button className="demo-primary" type="button" disabled={dirty || !approved || !audience.trim() || Boolean(htmlBlock)} onClick={() => { setSaved({ title, audience, priority, schedule: schedule || 'Not scheduled', reviewer: email, approved: true, templateCharacters: html.length }); setFeedback('Confirmed in this browser session. No campaign is scheduled or sent.'); }}>Confirm sample campaign</button>
      {saved && <pre className="demo-record">{JSON.stringify(saved, null, 2)}</pre>}
    </>}
    <p className="demo-feedback" role="status">{feedback}</p>
  </div>;
}
