import { career, education, impact, principles, profile, projects, resolutionOutcomes, skills } from "../../data/portfolio";
import "../css/PortfolioContent.css";
import { navigateToProject } from "./pageNavigation";
import ContactForm from "./ContactForm";
import ContactCharacterSequence from "./ContactCharacterSequence";

function SectionHeading({ number, label, title, children }) {
  return <header className="cv-section-heading">
    <p className="portfolio-label">{number} / {label}</p>
    <div><h2 data-cursor-highlight>{title}</h2>{children && <p className="cv-section-intro">{children}</p>}</div>
  </header>;
}

export default function PortfolioContent() {
  return <div className="portfolio-cv">
    <section id="about" data-guide-section="about" className="cv-section" aria-label="About Renzil">
      <SectionHeading number="01" label="The person behind the code" title={profile.headline} />
      <div className="cv-about-copy"><p>{profile.about}</p><p>{profile.perspective}</p></div>
      <div className="cv-profile-line"><span>{profile.location}</span><span>Architecture / Automation / Applied AI</span><a href="/resume.pdf" target="_blank" rel="noreferrer" data-cursor>Résumé ↗</a></div>
    </section>

    <section id="career" data-guide-section="career" className="cv-section" aria-label="Career timeline">
      <SectionHeading number="02" label="Career" title="A path built from the inside out.">Operations and training grew into automation, full-stack engineering and systems architecture. Each step built on the one before it.</SectionHeading>
      <ol className="cv-timeline">{career.map((role) => <li key={role.title}>
        <div className="cv-timeline-date"><span>{role.date}</span><span>{role.company}</span></div>
        <div><h3>{role.title}</h3><p>{role.summary}</p><ul>{role.contributions.map((text) => <li key={text}>{text}</li>)}</ul></div>
      </li>)}</ol>
    </section>

    <section id="work" data-guide-section="work" className="cv-section" aria-label="Selected projects">
      <SectionHeading number="03" label="Selected work" title="Systems with a job to do.">Four systems, built around real workflows. Explore the context, architecture, contributions and a small interactive walkthrough for each.</SectionHeading>
      <div className="cv-project-grid work-project-grid">{projects.map((project, index) => <article className="cv-project work-project" key={project.id}>
        <div className="cv-card-meta"><span>0{index + 1} / {project.category}</span><span className="cv-status">{project.status}</span></div>
        <h3 data-cursor-highlight>{project.name}</h3><p>{project.description}</p>
        <ul className="work-highlights">{project.highlights.map((text) => <li key={text}>{text}</li>)}</ul>
        <div className="cv-tags">{project.stack.slice(0, 4).map((tool, pillIndex) => <span key={tool} style={{ "--pill-index": pillIndex }}>{tool}</span>)}</div>
        <a className="work-case-link" href={`/work/${project.id}`} onClick={(event) => { event.preventDefault(); navigateToProject(project.id); }}>Explore the project <span aria-hidden="true">↗</span></a>
      </article>)}</div>
    </section>

    <section id="impact" data-guide-section="impact" className="cv-section" aria-label="Reported impact">
      <SectionHeading number="04" label="Reported impact" title="Outcomes beyond the code.">Self-reported figures from my work at Swiggy. Savings are associated or projected estimates, not independently audited figures; the initiatives are not added into a single total.</SectionHeading>
      <div className="cv-impact-grid">{impact.map((item) => <article key={item.label}><p className="cv-impact-value">{item.value}</p><h3>{item.label}</h3><p>{item.detail}</p></article>)}</div>
      <div className="cv-resolution"><h3>Reported resolution improvements</h3>{resolutionOutcomes.map((item) => <div key={item.label}><span>{item.label}</span><span>{item.before} <i aria-hidden="true">→</i> <strong>{item.after}</strong></span></div>)}</div>
      <p className="cv-impact-note">Additional reported scope: approximately 600 communication templates standardized in a three-month reporting window, an LMS serving 5,000+ users, and a Swiggy Genie rollout across approximately 55 cities.</p>
    </section>

    <section id="skills" data-guide-section="skills" className="cv-section" aria-label="Technical capabilities">
      <SectionHeading number="05" label="Capabilities" title="Breadth, with a practical purpose.">The stack changes with the problem. The common thread is making reliable systems that people can use and maintain.</SectionHeading>
      <div className="cv-skills-grid">{skills.map((group) => <article key={group.name}><h3 data-cursor-highlight>{group.name}</h3><p>{group.description}</p><div className="cv-tags">{group.tools.map((tool, index) => <span key={tool} style={{ "--pill-index": index }}>{tool}</span>)}</div></article>)}</div>
    </section>

    <section id="approach" data-guide-section="approach" className="cv-section" aria-label="Engineering approach">
      <SectionHeading number="06" label="How I build" title="Useful first. Thoughtful throughout." />
      <div className="cv-principles">{principles.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </section>

    <section id="education" data-guide-section="education" className="cv-section" aria-label="Education and certifications">
      <SectionHeading number="07" label="Learning" title="A commerce foundation. An engineering journey." />
      <div className="cv-education">{education.map((item) => <article key={item.title}><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.institution}</p></div></article>)}</div>
    </section>

    <section id="contact" data-guide-section="contact" className="cv-section cv-contact" aria-label="Contact">
      <div className="cv-contact-grid"><div className="cv-contact-copy">
      <SectionHeading number="08" label="Let’s connect" title="Have a system worth building?">I’m interested in meaningful ownership, hands-on engineering leadership and products that solve real workflow problems.</SectionHeading>
      <a className="cv-email" href={`mailto:${profile.email}`} data-cursor>{profile.email} <span aria-hidden="true">↗</span></a>
      <nav aria-label="Professional profiles"><a href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor>LinkedIn ↗</a><a href={profile.github} target="_blank" rel="noreferrer" data-cursor>GitHub ↗</a><a href="/resume.pdf" target="_blank" rel="noreferrer" data-cursor>Résumé ↗</a></nav>
      <ContactForm /></div><ContactCharacterSequence /></div>
    </section>
    <footer className="cv-footer"><span>{profile.name} / {profile.handle}</span><a href="https://github.com/rien-zi/rien-zi-portfolio" target="_blank" rel="noopener noreferrer">Source code ↗</a><a href="/third-party-notices.txt">Licenses & credits</a></footer>
  </div>;
}
