import { useState } from 'react';
import '../css/ContactForm.css';
const purposes = [
  ['Project Collaboration', 'excited', 'Two brains, one interesting idea.'],
  ['Hiring/Job Opportunity', 'proud', 'A new chapter? I’m listening.'],
  ['Freelance Development', 'working', 'Let’s make that idea work.'],
  ['Technical Consultation', 'thinking', 'A good puzzle deserves company.'],
  ['Something Else', 'curious', 'Mystery door. Go on…'],
];
export default function ContactForm() {
  const [purpose, setPurpose] = useState(purposes[0][0]);
  const [note, setNote] = useState(purposes[0][2]);
  const [status, setStatus] = useState('');
  const [url, setUrl] = useState('');
  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = values.get('name').trim();
    const description = values.get('description').trim();
    if (!name || !description) { setStatus('A name and a little context, please.'); return; }
    const email = values.get('email').trim();
    const message = `Hi, I'm ${name}.\n\n*I'm looking for:* ${purpose}\n${email ? `\n*Email:* ${email}\n` : ''}\n*Description:*\n${description}\n\nI found you through your portfolio.`;
    const target = `https://wa.me/917259540700?text=${encodeURIComponent(message)}`;
    setUrl(target);
    window.open(target, '_blank', 'noopener,noreferrer');
    setStatus('Your message is prepared. Review it and tap Send in WhatsApp. If the new tab did not open, use the link below.');
  };
  return <form className="contact-form" onSubmit={submit} aria-labelledby="contact-form-title" onChange={() => { setUrl(''); setStatus(''); }}>
    <h3 id="contact-form-title">A hello with a little context.</h3>
    <p>Kyubee takes the introduction. WhatsApp takes the conversation.</p>
    <label htmlFor="contact-name">Your name <span>(required)</span></label>
    <input id="contact-name" name="name" autoComplete="name" required maxLength={80} placeholder="What should I call you?" />
    <fieldset><legend>What are you looking for?</legend><div className="contact-purposes">{purposes.map(([label, reaction, reply]) => <label key={label} className={purpose === label ? 'is-selected' : ''}>
      <input type="radio" name="purpose" value={label} checked={purpose === label} onChange={() => { setPurpose(label); setNote(reply); window.dispatchEvent(new CustomEvent('kyubee:game-reaction', { detail: { animation: `gesture-${reaction}` } })); }} />{label}
    </label>)}</div></fieldset>
    <p className="contact-quirk" role="status">Kyubee / {note}</p>
    <label htmlFor="contact-email">Email <span>(optional)</span></label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="Only if you’d like to share it" />
    <label htmlFor="contact-description">A little about your idea <span>(required)</span></label><textarea id="contact-description" name="description" required maxLength={1800} rows={5} placeholder="The idea, the challenge, the wildly optimistic plan…" />
    <p id="whatsapp-explanation" className="contact-disclosure">Opens WhatsApp with your details addressed to Renzil (+91 7259540700). You review and send the message there. This form does not save your details or send them automatically.</p>
    <button type="submit" aria-describedby="whatsapp-explanation">Let’s talk on WhatsApp ↗</button>
    <p role="status">{status}</p>{url && <a href={url} target="_blank" rel="noopener noreferrer">Open the prepared WhatsApp message ↗</a>}
  </form>;
}
