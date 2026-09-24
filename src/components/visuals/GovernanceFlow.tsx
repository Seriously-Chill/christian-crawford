import { textH5 } from "@/lib/type";

type Step = { stage: string; text: string; outcome?: boolean };

type Path = {
  id: string;
  tool: string;
  title: string;
  steps: Step[];
  scope: string;
  scopeNote: string;
};

const paths: Path[] = [
  {
    id: "edit",
    tool: "Edit / Write",
    title: "Direct edits",
    steps: [
      { stage: "Tool call", text: "Claude Code tries to edit or write a governance file." },
      { stage: "PreToolUse", text: "A hook pauses the edit and asks me to confirm it." },
      {
        stage: "PostToolUse",
        text: "If I approve, the edit applies and a second hook marks the file as reviewed.",
        outcome: true,
      },
    ],
    scope: "All protected files, including AGENTS.md",
    scopeNote: "Checked before anything changes.",
  },
  {
    id: "bash",
    tool: "Bash",
    title: "Shell commands",
    steps: [
      { stage: "Tool call", text: "Claude Code runs a shell command, such as sed, a redirect, or cp." },
      { stage: "Command runs", text: "Nothing checks the command first, so any file changes happen." },
      {
        stage: "PostToolUse",
        text: "A hook compares governance file timestamps with the session baseline and review markers.",
      },
      {
        stage: "Result",
        text: "An unreviewed change blocks Claude Code from continuing until I review it.",
        outcome: true,
      },
    ],
    scope: "All protected files except AGENTS.md",
    scopeNote: "next dev rewrites AGENTS.md on its own, so its timestamp moves without any agent action.",
  },
];

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 24"
      className="mx-auto my-space-1 h-6 w-4 text-ink/40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v18M3 15l5 5 5-5" />
    </svg>
  );
}

/**
 * `/ai` workflow diagram — the two tool paths the governance hooks cover,
 * drawn in HTML rather than an image so the steps stay real text (an
 * ordered list per path) at every width. The paths sit side by side from
 * `md` up and stack below it. The shared-state strip underneath is the
 * link between them: the Edit/Write path writes the review marker the
 * Bash check reads, alongside the SessionStart baseline. Colors come from
 * the existing ink/surface/accent tokens, so every picker theme applies.
 */
export function GovernanceFlow() {
  return (
    <figure aria-labelledby="governance-flow-caption" className="mx-auto max-w-4xl">
      <div className="grid gap-space-3 md:grid-cols-2">
        {paths.map((path) => (
          <section
            key={path.id}
            aria-labelledby={`flow-${path.id}`}
            className="flex flex-col rounded-lg border border-ink/10 bg-surface p-space-2 sm:p-space-3"
          >
            <p className="text-label text-accent">{path.tool}</p>
            <h3 id={`flow-${path.id}`} className={`mt-space-1 text-ink ${textH5}`}>
              {path.title}
            </h3>
            <ol className="mt-space-2 flex-1">
              {path.steps.map((step, i) => (
                <li key={step.stage}>
                  {i > 0 ? <Arrow /> : null}
                  <div
                    className={`rounded-md border bg-surface-raised px-space-2 py-space-2 ${
                      step.outcome ? "border-accent" : "border-ink/10"
                    }`}
                  >
                    <p className="text-label text-ink/72">
                      <span className="sr-only">Step {i + 1}: </span>
                      {step.stage}
                    </p>
                    <p className="mt-space-1 text-body text-ink">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-space-3 border-t border-ink/10 pt-space-2">
              <p className="text-label text-ink">{path.scope}</p>
              <p className="mt-space-1 text-body text-ink/72">{path.scopeNote}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-space-3 rounded-lg border border-dashed border-ink/20 px-space-2 py-space-2 sm:px-space-3">
        <p className="text-label text-ink">Shared session state</p>
        <p className="mt-space-1 text-body text-ink/72">
          A SessionStart hook records a baseline time. The Edit / Write path adds a review marker
          for each approved file, and the Bash check reads both, so it only flags changes made
          since the session began that nobody has reviewed.
        </p>
      </div>

      <figcaption id="governance-flow-caption" className="mt-space-3 text-center text-label text-ink/72">
        How the Claude Code hooks in this site&apos;s repository handle the two ways a governance
        file can change.
      </figcaption>
    </figure>
  );
}
