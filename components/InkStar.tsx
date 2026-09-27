/**
 * Eight-spoked asterisk drawn as SVG. The ✳ character renders as a colour
 * emoji on many platforms and ignores CSS `color`; this inherits it.
 */
export function InkStar() {
  return (
    <svg
      className="ink-star-glyph"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </svg>
  );
}
