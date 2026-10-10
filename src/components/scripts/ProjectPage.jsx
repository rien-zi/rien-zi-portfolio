import { lazy, Suspense } from 'react';
import { projects } from '../../data/portfolio';
import { navigateToProject, navigateToSection } from './pageNavigation';
import '../css/ProjectPage.css';
const demos = {
  resolute: lazy(() => import('./projects/ResoluteDemo')),
  middleware: lazy(() => import('./projects/MiddlewareDemo')),
  rag: lazy(() => import('./projects/RagDemo')),
  campaign: lazy(() => import('./projects/CampaignDemo')),
};
export default function ProjectPage({ projectId }) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return <article className="project-page"><h1>That project isn’t here.</h1><button type="button" onClick={() => navigateToSection('work')}>Back to selected work ↗</button></article>;
  const Demo = demos[project.demo];
  return <article className="project-page" data-guide-section={`project:${project.id}`}>
    <header className="project-page-heading">
      <a href="/#work" onClick={(event) => { event.preventDefault(); navigateToSection('work'); }}>← Selected work</a>
      <div className="project-page-meta"><span>{project.category}</span><span>{project.status}</span></div>
      <h1 data-cursor-highlight>{project.name}</h1><p className="project-page-intro">{project.description}</p>
      <p className="project-page-role">My role / {project.role}</p>
      <div className="cv-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
    </header>
    <section className="project-page-section"><p className="portfolio-label">01 / The context</p><div className="project-context-grid"><div><h2>The problem</h2><p>{project.problem}</p></div><div><h2>The response</h2><p>{project.solution}</p></div></div></section>
    <section className="project-page-section"><p className="portfolio-label">02 / The system</p><h2 data-cursor-highlight>A workflow with clear boundaries.</h2><ol className="project-flow">{project.flow.map((stage, index) => <li key={stage}><span>0{index + 1}</span>{stage}</li>)}</ol><div className="project-decisions">{project.decisions.map((decision) => <article key={decision.title}><h3>{decision.title}</h3><p>{decision.text}</p></article>)}</div></section>
    <section className="project-page-section"><p className="portfolio-label">03 / My contribution</p><h2 data-cursor-highlight>From the workflow to the working system.</h2><ul className="project-contributions">{project.contributions.map((text) => <li key={text}>{text}</li>)}</ul></section>
    <section className="project-page-section"><p className="portfolio-label">04 / Outcomes</p><div className="project-metrics">{project.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div><p>{project.outcome}</p>{project.next && <p className="project-next"><strong>In progress:</strong> {project.next}</p>}</section>
    <section className="project-page-section" id="project-demo"><p className="portfolio-label">05 / Try the idea</p><h2 data-cursor-highlight>A small, hands-on walkthrough.</h2><Suspense fallback={<p role="status">Preparing the local demo…</p>}><Demo /></Suspense></section>
    <footer className="project-page-footer"><h2>Another system worth exploring?</h2><nav aria-label="Other project pages">{projects.filter((item) => item.id !== projectId).map((item) => <a key={item.id} href={`/work/${item.id}`} onClick={(event) => { event.preventDefault(); navigateToProject(item.id); }}>{item.name} ↗</a>)}</nav><button type="button" onClick={() => navigateToSection('work')}>Back to the portfolio ←</button></footer>
  </article>;
}
