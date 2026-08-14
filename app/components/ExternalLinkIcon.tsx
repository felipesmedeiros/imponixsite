type ExternalLinkIconProps = {
  className?: string;
};

export function ExternalLinkIcon({ className = "" }: ExternalLinkIconProps) {
  return (
    <svg
      className={`external-link-icon ${className}`.trim()}
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      focusable="false"
    >
      <path
        d="M4.75 11.25 11.25 4.75M6 4.75h5.25V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
