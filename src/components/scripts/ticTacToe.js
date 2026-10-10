export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
];
export const DIFFICULTIES = {
  easy: { label: 'Easy', description: 'Blobee picks a random empty square. A little chaos, plenty of chances.' },
  normal: { label: 'Normal', description: 'Blobee takes a winning move, usually blocks yours, then improvises.' },
  hard: { label: 'Hard', description: 'Blobee plans ahead and randomizes equally strong moves. Aim for a draw.' },
};
export function getResult(board) {
  const line = WIN_LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  return line ? { winner: board[line[0]], line } : board.every(Boolean) ? { winner: 'draw', line: [] } : null;
}
const available = (board) => board.flatMap((cell, index) => cell ? [] : [index]);
const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const winningMove = (board, player) => available(board).find((index) => {
  const next = [...board]; next[index] = player;
  return getResult(next)?.winner === player;
});
function minimax(board, player, depth) {
  const result = getResult(board);
  if (result) return result.winner === 'B' ? 10 - depth : result.winner === 'K' ? depth - 10 : 0;
  const scores = available(board).map((index) => {
    const next = [...board]; next[index] = player;
    return minimax(next, player === 'B' ? 'K' : 'B', depth + 1);
  });
  return player === 'B' ? Math.max(...scores) : Math.min(...scores);
}
export function chooseBlobeeMove(board, difficulty) {
  const cells = available(board);
  if (!cells.length || getResult(board)) return null;
  if (difficulty === 'easy') return randomItem(cells);
  if (difficulty === 'normal') {
    const win = winningMove(board, 'B');
    if (win !== undefined) return win;
    const block = winningMove(board, 'K');
    if (block !== undefined && Math.random() < .8) return block;
    return randomItem(cells);
  }
  const scored = cells.map((index) => {
    const next = [...board]; next[index] = 'B';
    return { index, score: minimax(next, 'K', 0) };
  });
  const best = Math.max(...scored.map((move) => move.score));
  return randomItem(scored.filter((move) => move.score === best)).index;
}
export const initialGame = {
  board: Array(9).fill(null), turn: 'K', difficulty: 'easy', round: 0,
  scores: { K: 0, B: 0, draw: 0 }, result: null, lastMove: null,
};
export function gameReducer(state, action) {
  if (action.type === 'new-round' || action.type === 'difficulty') {
    if (action.type === 'difficulty' && !DIFFICULTIES[action.difficulty]) return state;
    return { ...state, board: Array(9).fill(null), turn: 'K', result: null, lastMove: null,
      difficulty: action.difficulty ?? state.difficulty, round: state.round + 1 };
  }
  if (action.type === 'reset-scores') return { ...initialGame, difficulty: state.difficulty, scores: { K: 0, B: 0, draw: 0 }, round: state.round + 1 };
  if (action.type !== 'move' || state.result || state.turn !== action.player || action.round !== state.round
    || !Number.isInteger(action.index) || action.index < 0 || action.index > 8 || state.board[action.index]) return state;
  const board = [...state.board]; board[action.index] = action.player;
  const result = getResult(board);
  return { ...state, board, result, lastMove: { index: action.index, player: action.player }, turn: result ? null : action.player === 'K' ? 'B' : 'K',
    scores: result ? { ...state.scores, [result.winner]: state.scores[result.winner] + 1 } : state.scores };
}
