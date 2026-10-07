import type { ReactNode } from "react";
import { textH5 } from "@/lib/type";
import { FlowArrow } from "@/components/visuals/FlowArrow";
import { FigureCaption } from "@/components/visuals/FigureCaption";
import { DiagramBox } from "@/components/visuals/DiagramBox";
import { Pill } from "@/components/ui/Pill";

const requests = ["Look up an order", "Correct a patient record", "Pull a report", "Rotate an API key"];

const pitch = ["The problem", "A solution for each area", "Rabbit holes", "Out of scope"];

// Drawn from the portal's orders list: its two labeled filter fields, and
// a record opened as panels over the list. No data, and no invented values.
function PortalScreen() {
  return (
    <div aria-hidden="true" className="flex rounded-md border border-line bg-surface">
      <div className="flex w-8 shrink-0 flex-col gap-1.5 rounded-l-md border-r border-hairline bg-ink/3 p-1.5 pt-2.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1.5 rounded-pill ${i === 1 ? "bg-accent" : "bg-ink/15"}`} />
        ))}
      </div>
      <div className="min-w-0 flex-1 p-2">
        <div className="flex flex-wrap gap-1.5">
          {["Order #", "Customer email"].map((label) => (
            <span
              key={label}
              className="rounded-[4px] border border-ink/25 px-1.5 py-1 text-[12px] leading-none text-muted"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="relative mt-2.5 grid gap-2">
          <span className="h-1.5 rounded-pill bg-ink/25" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className={`h-1.5 rounded-pill ${i === 1 ? "bg-accent/40" : "bg-ink/10"}`} />
          ))}
          <div className="absolute -inset-y-1 right-0 w-1/2 border-l border-line bg-surface p-1.5 shadow-[-4px_0_12px_-6px] shadow-ink/25">
            <span className="block h-1.5 w-2/3 rounded-pill bg-ink/40" />
            <span className="mt-1.5 block h-1 w-full rounded-pill bg-ink/10" />
            <span className="mt-1 block h-1 w-3/4 rounded-pill bg-ink/10" />
            <div className="absolute inset-y-1.5 right-0 w-3/4 rounded-l-[4px] border border-r-0 border-accent bg-surface p-1.5">
              <span className="block h-1.5 w-1/2 rounded-pill bg-accent" />
              <span className="mt-1.5 block h-1 w-full rounded-pill bg-ink/10" />
              <span className="mt-1 block h-1 w-2/3 rounded-pill bg-ink/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage({ step, title, children }: { step: string; title: string; children: ReactNode }) {
  return (
    <DiagramBox tone="frame" className="flex h-full flex-col">
      <p className="text-label text-muted">{step}</p>
      <p className={`mt-space-1 text-ink ${textH5}`}>{title}</p>
      <div className="mt-space-2 flex-1">{children}</div>
    </DiagramBox>
  );
}

/**
 * Home's product-and-UX proof: how the portal went from routine requests
 * sent by email, to a written pitch, to working screens. Each stage is real
 * text; the portal screen is a decorative drawing of the orders list,
 * described in the stage's own text. Drawn in HTML like `SheetStackDiagram`.
 */
export function PortalShapingDiagram() {
  return (
    <figure aria-labelledby="portal-shaping-caption">
      <ol className="flex flex-col md:flex-row">
        <li className="md:flex-1">
          <Stage step="Before" title="Every request, one inbox">
            <ul className="flex flex-wrap gap-1.5">
              {requests.map((item) => (
                <Pill as="li" key={item} compact className="leading-snug">
                  {item}
                </Pill>
              ))}
            </ul>
            <p className="mt-space-2 text-body text-muted">All by email, each waiting on an engineer.</p>
          </Stage>
        </li>
        <li className="flex flex-col md:flex-1 md:flex-row">
          <FlowArrow className="mx-auto my-space-1 md:mx-space-1 md:my-auto md:-rotate-90" />
          <Stage step="Shaped" title="A written pitch">
            <ol className="grid gap-1.5">
              {pitch.map((item) => (
                <li key={item} className="flex items-center gap-space-1 text-label leading-snug text-muted">
                  <span aria-hidden="true" className="h-4 w-1 shrink-0 rounded-pill bg-accent" />
                  {item}
                </li>
              ))}
            </ol>
          </Stage>
        </li>
        <li className="flex flex-col md:flex-1 md:flex-row">
          <FlowArrow className="mx-auto my-space-1 md:mx-space-1 md:my-auto md:-rotate-90" />
          <Stage step="Built" title="Working screens">
            <PortalScreen />
            <p className="mt-space-2 text-body text-muted">
              Labeled filters, and records that open over the list.
            </p>
          </Stage>
        </li>
      </ol>
      <FigureCaption id="portal-shaping-caption">
        The screen is drawn from the portal’s orders list, without its data.
      </FigureCaption>
    </figure>
  );
}
