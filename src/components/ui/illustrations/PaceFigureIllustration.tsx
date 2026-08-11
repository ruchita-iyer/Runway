export function PaceFigureIllustration({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="30" cy="12" r="4" />
      <path d="M30 16.5 26 27l6 4 1 12" />
      <path d="M26 27 17 30" />
      <path d="M32 31 41 26" />
      <path d="M33 31 41 41" />
      <path d="M17 24h6" opacity="0.5" />
      <path d="M13 30h7" opacity="0.65" />
      <path d="M10 36h9" opacity="0.4" />
    </svg>
  );
}
