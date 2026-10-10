import { useEffect, useReducer, useRef } from 'react';
import { chooseBlobeeMove, DIFFICULTIES, gameReducer, initialGame } from './ticTacToe';
import GameAvatar from './GameAvatar';
import '../css/GamesSection.css';

function react(animation) {
  window.dispatchEvent(new CustomEvent('kyubee:game-reaction', { detail: { animation } }));
}
export default function GamesSection({ initialDifficulty = "easy" }) {
  const [game, dispatch] = useReducer(gameReducer, initialGame, (game) => ({ ...game, difficulty: DIFFICULTIES[initialDifficulty] ? initialDifficulty : "easy" }));
  const boardRef = useRef(null);
  const lastResultRef = useRef(null);
  useEffect(() => {
    const configure = (event) => { dispatch({ type: 'difficulty', difficulty: event.detail?.difficulty }); };
    window.addEventListener('kyubee:game-config', configure);
    return () => window.removeEventListener('kyubee:game-config', configure);
  }, []);
  useEffect(() => {
    if (game.turn !== 'B' || game.result) return;
    const timer = window.setTimeout(() => {
      const index = chooseBlobeeMove(game.board, game.difficulty);
      if (index !== null) dispatch({ type: 'move', player: 'B', index, round: game.round });
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 250 : 650 + Math.random() * 400);
    return () => window.clearTimeout(timer);
  }, [game.board, game.turn, game.result, game.difficulty, game.round]);
  useEffect(() => {
    if (!game.result) { lastResultRef.current = null; return; }
    if (lastResultRef.current === game.result) return;
    lastResultRef.current = game.result;
    react(game.result.winner === 'K' ? 'gesture-celebrate' : game.result.winner === 'B' ? 'gesture-surprised' : 'gesture-happy');
  }, [game.result]);
  const move = (index) => {
    if (game.turn !== 'K' || game.result || game.board[index]) return;
    dispatch({ type: 'move', player: 'K', index, round: game.round });
    react('gesture-thinking');
  };
  const navigateCells = (event, index) => {
    const direction = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[event.key];
    if (!direction) return;
    event.preventDefault();
    for (let offset = 1; offset <= 9; offset++) {
      const next = (index + direction * offset + 90) % 9;
      const button = boardRef.current?.querySelector(`[data-cell="${next}"]`);
      if (button && !button.disabled) { button.focus(); break; }
    }
  };
  const winner = game.result?.winner;
  const message = winner === 'K' ? 'You and Kyubee win. Nicely played!'
    : winner === 'B' ? 'Blobee wins this round. Ready for a rematch?'
    : winner === 'draw' ? 'A draw. Two very competitive little characters.'
    : game.turn === 'B' ? 'Blobee is choosing a square…'
    : game.lastMove?.player === 'B' ? `Blobee chose row ${Math.floor(game.lastMove.index / 3) + 1}, column ${game.lastMove.index % 3 + 1}. Your move.` : 'Your move. Pick a square for Kyubee.';
  return <section id="games" data-guide-section="games" className="cv-section games-section" data-cursor-normal aria-labelledby="games-title">
    <header className="games-heading"><p className="portfolio-label">A little play / Tic Tac Toe</p><h2 id="games-title">Kyubee vs. Blobee</h2><p>You’re Kyubee. Blobee takes the other side. Three in a row wins.</p></header>
    <div className="games-arena">
      <aside className="games-sidebar">
        <p className="games-kicker">Tic Tac Toe / Human vs. bot</p>
        <div className="games-players"><div><GameAvatar character="K" /><span>You · Kyubee</span></div><span className="games-versus">vs.</span><div><GameAvatar character="B" /><span>Bot · Blobee</span></div></div>
        <fieldset className="games-difficulty"><legend>How clever is Blobee?</legend><div>{Object.entries(DIFFICULTIES).map(([id, mode]) => <button type="button" key={id} aria-pressed={game.difficulty === id} onClick={() => dispatch({ type: 'difficulty', difficulty: id })} data-cursor>{mode.label}</button>)}</div></fieldset>
        <p className="games-mode-description">{DIFFICULTIES[game.difficulty].description} Changing mode starts a fresh round.</p>
        <div className="games-scoreboard" aria-label="Session scores"><div><strong>{game.scores.K}</strong><span>You</span></div><div><strong>{game.scores.draw}</strong><span>Draws</span></div><div><strong>{game.scores.B}</strong><span>Blobee</span></div></div>
        <p className="games-rule">You start every round. Match three horizontally, vertically or diagonally.</p>
        <button className="games-reset-scores" type="button" onClick={() => dispatch({ type: 'reset-scores' })} data-cursor>Reset scores</button>
      </aside>
      <div className="games-play-area" data-cubee-obstacle>
        <div className="games-status" role="status" aria-live="polite"><span className={game.turn === 'B' ? 'is-thinking' : ''} aria-hidden="true" />{message}</div>
        <div ref={boardRef} className="games-board" role="group" aria-label="Tic Tac Toe board">{game.board.map((cell, index) => <button
          key={index} type="button" data-cell={index} data-player={cell ?? undefined}
          className={`games-cell${game.result?.line.includes(index) ? ' is-winning' : ''}`}
          disabled={Boolean(cell) || game.turn !== 'K' || Boolean(game.result)}
          aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: ${cell === 'K' ? 'Kyubee' : cell === 'B' ? 'Blobee' : 'empty'}`}
          onClick={() => move(index)} onKeyDown={(event) => navigateCells(event, index)} data-cursor>
          {cell ? <GameAvatar character={cell} /> : <span className="games-cell-preview"><GameAvatar character="K" /></span>}
        </button>)}</div>
        <div className="games-board-footer"><span>{winner ? 'Round complete' : `${game.board.filter(Boolean).length} / 9 squares occupied`}</span><button type="button" className="games-new-round" onClick={() => { dispatch({ type: 'new-round' }); react('gesture-playful'); }} data-cursor>{winner ? 'Play again' : 'New round'} <span aria-hidden="true">↗</span></button></div>
      </div>
    </div>
  </section>;
}
