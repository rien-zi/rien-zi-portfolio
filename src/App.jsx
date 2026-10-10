import { Fragment, useCallback, useRef, useState } from "react";
import usePageMetadata from "./components/scripts/usePageMetadata";
import usePortfolioLoop from "./components/scripts/usePortfolioLoop";
import ProjectPage from "./components/scripts/ProjectPage";
import Cubee from "./components/scripts/Cubee";
import GamesSection from "./components/scripts/GamesSection";
import usePageNavigation from "./components/scripts/usePageNavigation";
import Navbar from "./components/scripts/Navbar";
import CleanHero from "./components/scripts/CleanHero";
import CustomCursor from "./components/scripts/CustomCursor";
import Loader from "./components/scripts/Loader";
import PortfolioContent from "./components/scripts/PortfolioContent";

export default function App() {
  const { page, gamePage, projectId, difficulty } = usePageNavigation();
  const [loading, setLoading] = useState(true);
  usePageMetadata(page);
  const cycleRef = useRef(null);
  const beforeRef = useRef(null);
  const afterRef = useRef(null);
  const loop = usePortfolioLoop(page, !loading, cycleRef, beforeRef, afterRef);
  const finishLoading = useCallback(() => setLoading(false), []);
  return (
    <>
      <CustomCursor />
      <Navbar ready={!loading} gamePage={gamePage} projectPage={Boolean(projectId)} loop={loop} />

      <a className="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content" tabIndex={-1} inert={loading} aria-hidden={loading ? true : undefined}>
        {projectId ? <Fragment key={`project:${projectId}`}><ProjectPage key={projectId} projectId={projectId} /><Cubee ready={!loading} page={page} /></Fragment> : gamePage ? <div key="games" className="game-page">
          <GamesSection initialDifficulty={difficulty} />
          <Cubee ready={!loading} page="games" />
        </div> : <div key="portfolio" className="portfolio-page">
          <div ref={beforeRef} className="portfolio-replica" aria-hidden="true" />
          <div ref={cycleRef} data-portfolio-cycle><CleanHero ready={!loading} /><PortfolioContent /></div>
          <div ref={afterRef} className="portfolio-replica" aria-hidden="true" />
        </div>}
      </main>
      {loading && <Loader onDone={finishLoading} />}
    </>
  );
}
