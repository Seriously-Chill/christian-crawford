/**
 * The site's one line-icon set: 24px grid, 1.5px round strokes, drawn in
 * `currentColor` so every picker theme applies. Always decorative: each
 * use sits next to text that says the same thing, or on a control with its
 * own label.
 */
const paths = {
  mail: "M3.5 6.5h17v11h-17v-11ZM3.5 7l8.5 6.5L20.5 7",
  external: "M14 4h6v6M20 4l-9 9M18 14v5.5H4.5V6H10",
  download: "M12 4v11M7 10l5 5 5-5M5 19.5h14",
  pin: "M12 21s-6.5-6-6.5-11a6.5 6.5 0 1 1 13 0c0 5-6.5 11-6.5 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  left: "M19 12H5M11 6l-6 6 6 6",
  right: "M5 12h14M13 6l6 6-6 6",
  pause: "M9 5v14M15 5v14",
  play: "M8 5v14l11-7L8 5Z",
} as const;

export type IconName = keyof typeof paths;

/** `className` sizes it; the default is the inline size beside text. */
export function LineIcon({ name, className = "size-6 shrink-0" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
