export function QuickLogIllustration({ size = 56, className }: { size?: number; className?: string }) {
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
      <circle cx="25" cy="29" r="17" />
      <path d="M25 19v10l7 4" />
      <path d="M25 8v3.5" opacity="0.6" />
      <path d="M10 14l2.5 2.5" opacity="0.6" />
      <path d="M40 14l-2.5 2.5" opacity="0.6" />
      <path d="M33 26 27 38h6l-3 10 9-15h-6l3-7Z" fill="currentColor" stroke="none" opacity="0.95" />
    </svg>
  );
}
