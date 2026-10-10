import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../css/KyubeeConversation.css';

export default function KyubeeConversation({ node, followerRef, onSelect, onClose, onPosition, canGoBack, onBack, topics }) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const dismissOutside = (event) => {
      if (!panelRef.current?.contains(event.target) && !followerRef.current?.contains(event.target)) closeRef.current(false);
    };
    window.addEventListener('pointerdown', dismissOutside);
    return () => window.removeEventListener('pointerdown', dismissOutside);
  }, [followerRef]);
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const position = () => {
      const anchor = followerRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const bounds = panel.getBoundingClientRect();
      const width = window.innerWidth;
      const height = window.visualViewport?.height ?? window.innerHeight;
      let left = anchor.right + 16;
      if (left + bounds.width > width - 16) left = anchor.left - bounds.width - 16;
      if (left < 16) left = (width - bounds.width) / 2;
      let top = anchor.top + (anchor.height - bounds.height) / 2;
      if (anchor.width > 200) top = anchor.bottom + 8;
      if (top + bounds.height > height - 16) top = anchor.top - bounds.height - 12;
      left = Math.max(16, Math.min(left, width - bounds.width - 16));
      top = Math.max(16, Math.min(top, height - bounds.height - 16));
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      const dx = left + bounds.width / 2 - (anchor.left + anchor.width / 2);
      const dy = top + bounds.height / 2 - (anchor.top + anchor.height / 2);
      onPosition(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'));
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(panel);
    window.addEventListener('resize', position);
    window.visualViewport?.addEventListener('resize', position);
    return () => { observer.disconnect(); window.removeEventListener('resize', position); window.visualViewport?.removeEventListener('resize', position); };
  }, [node, followerRef, onPosition]);
  useLayoutEffect(() => {
    panelRef.current?.querySelector('.kyubee-choices button')?.focus({ preventScroll: true });
  }, [node]);
  return createPortal(<section ref={panelRef} className="kyubee-conversation" role="dialog" aria-label="Conversation with Kyubee" onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); onClose(); } }}>
    <header><span>Kyubee <span aria-hidden="true">✦</span></span><button type="button" onClick={() => onClose()} aria-label="Close conversation">×</button></header>
    <p lang={node.lang ?? 'en'} aria-live="polite" aria-atomic="true">{node.text}</p>
    {node.translation && <p className="kyubee-translation">{node.translation}</p>}
    {node.question && <p className="kyubee-question">{node.question}</p>}
    <div className="kyubee-choices">{node.options.map((choice) => <button type="button" key={`${choice.target}-${choice.label}`} onClick={() => onSelect(choice)}>{choice.label}<span aria-hidden="true">↗</span></button>)}</div>
    {node.sectionLink && <div className="kyubee-section-link"><p>{node.sectionLink.question}</p><button type="button" onClick={() => onSelect(node.sectionLink)}>{node.sectionLink.label} <span aria-hidden="true">↓</span></button></div>}
    <footer className="kyubee-conversation-footer">
      {canGoBack && <button type="button" onClick={onBack}>← Back</button>}
      <details><summary>Choose a topic</summary><nav aria-label="Conversation topics">{topics.map((topic) => <button type="button" key={topic.target ?? topic.action} onClick={() => onSelect(topic)}>{topic.label}</button>)}</nav></details>
    </footer>
  </section>, document.body);
}
