export function CompassIllustration({ size = 56, className }: { size?: number; className?: string }) {
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
      <circle cx="28" cy="28" r="19" />
      <circle cx="28" cy="28" r="1.5" fill="currentColor" stroke="none" />
      <path d="M34.5 20.5 25 25l-3.5 10.5L31 31l3.5-10.5Z" strokeLinejoin="round" />
      <path d="M28 4.5v4" />
      <path d="M28 47.5v4" />
      <path d="M4.5 28h4" />
      <path d="M47.5 28h4" opacity="0.55" />
      <path d="M14 42c3 3 6 4.5 9 4.5" strokeDasharray="1.6 3" opacity="0.5" />
    </svg>
  );
}
