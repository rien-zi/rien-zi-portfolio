import Cubee from "./Cubee";
import "../css/CleanHero.css";
import { profile } from "../../data/portfolio";

export default function CleanHero({ ready = true }) {
  return (
    <section id="hero" data-guide-section="hero" className="clean-hero" aria-labelledby="clean-hero-title">
      <div className="clean-hero-content">
        <div className="clean-hero-identity">
          <p className="clean-hero-eyebrow">{profile.name}</p>
          <h1 id="clean-hero-title" data-cursor-highlight>rien-<span>zi</span></h1>
          <p className="clean-hero-roles" data-cursor-highlight>
            <span>Technical Architect</span><i aria-hidden="true" />
            <span>Automation & AI</span><i aria-hidden="true" />
            <span>Systems builder</span>
          </p>
          <p className="clean-hero-description">
            {profile.intro}
          </p>
          <a className="clean-hero-cta" href="#work" data-cursor>
            Explore what I do <span aria-hidden="true">↗</span>
          </a>
        </div>

        <Cubee ready={ready} />
      </div>

      <div className="clean-hero-bottom">
        <span>Thoughtful code. A little personality.</span>
        <a href="#about" data-cursor>Scroll to explore <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
