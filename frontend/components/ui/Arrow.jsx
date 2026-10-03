/** Thin editorial arrow. `direction` = 'right' | 'up-right' | 'down' | 'left'. */
export default function Arrow({ direction = 'right', className = 'h-3.5 w-3.5' }) {
  const rotate = { right: 0, 'up-right': -45, down: 90, left: 180 }[direction] ?? 0;
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}
