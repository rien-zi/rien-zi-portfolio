// Small board tokens share the companion's colors without nine active renderers.
export default function GameAvatar({ character, className = '' }) {
  const cube = character === 'K';
  return <svg className={`game-avatar ${cube ? 'game-avatar-kyubee' : 'game-avatar-blobee'} ${className}`} viewBox="0 0 100 100" aria-hidden="true">
    <g transform={cube ? 'rotate(-8 50 50)' : 'rotate(10 50 50)'}>
      {cube ? <rect className="game-avatar-body" x="12" y="13" width="76" height="74" rx="23" />
        : <path className="game-avatar-body" d="M50 10 C73 9 92 29 90 52 C89 76 73 91 49 90 C24 91 8 74 10 49 C9 27 27 10 50 10 Z" />}
      <rect className="game-avatar-eye" x="36" y="39" width="8" height="15" rx="4" />
      <rect className="game-avatar-eye" x="52" y="37" width="10" height="19" rx="5" />
    </g>
  </svg>;
}
