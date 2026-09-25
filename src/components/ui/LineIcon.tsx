/**
 * The site's one line-icon set: 24px grid, 1.5px round strokes, drawn in
 * `currentColor` so every picker theme applies. The reference pairs icons
 * with its value and contact tiles and puts them in circle badges
 * (`radius-circle`, "icon badges" in tokens.json); `badge` renders that
 * form, `inline` a bare glyph for tile headings. Always decorative: each
 * use sits next to text that says the same thing.
 */
const paths = {
  layers: "M12 3 3 7.5l9 4.5 9-4.5L12 3ZM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20.5c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5",
  code: "m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16",
  shield: "M12 3 20 6v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3ZM8.5 12l2.5 2.5 4.5-5",
  people:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c2.1.6 3.5 2.5 3.5 5.2",
  mail: "M3.5 6.5h17v11h-17v-11ZM3.5 7l8.5 6.5L20.5 7",
  external: "M14 4h6v6M20 4l-9 9M18 14v5.5H4.5V6H10",
  download: "M12 4v11M7 10l5 5 5-5M5 19.5h14",
  pin: "M12 21s-6.5-6-6.5-11a6.5 6.5 0 1 1 13 0c0 5-6.5 11-6.5 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  up: "M12 19V5M6 11l6-6 6 6",
  down: "M12 5v14M6 13l6 6 6-6",
  pause: "M9 5v14M15 5v14",
  play: "M8 5v14l11-7L8 5Z",
} as const;

export type IconName = keyof typeof paths;

function Glyph({ name, className }: { name: IconName; className: string }) {
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

export function LineIcon({ name, variant = "inline" }: { name: IconName; variant?: "inline" | "badge" }) {
  if (variant === "badge") {
    return (
      <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-circle bg-on-header/15">
        <Glyph name={name} className="size-8" />
      </span>
    );
  }
  return <Glyph name={name} className="size-6 shrink-0" />;
}

export { Glyph as IconGlyph };
