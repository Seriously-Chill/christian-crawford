import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { EvidenceGrid } from "@/components/ui/EvidenceGrid";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { SheetStackDiagram } from "@/components/visuals/SheetStackDiagram";
import { PartnerRequestFlow } from "@/components/visuals/PartnerRequestFlow";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { TileList } from "@/components/ui/TileList";
import { textH4 } from "@/lib/type";

export const metadata: Metadata = {
  title: "Partner portal",
  description:
    "Shaping and building a self-service portal for pharmacy partners: a written pitch before any code, UX decisions made for the people using it, and an interface built to be linked, navigated by keyboard, and tested before its API was finished.",
};

// Told without internal names, schema, or code. The pitch itself is internal.
const shaping = [
  {
    title: "Out of scope, on purpose",
    body: "Role and permission management, and partner account administration. Everyone gets one role, so there’s no permission UI to design, build, or test.",
  },
  {
    title: "Gaps named up front",
    body: "Parts of the API didn’t exist yet. The pitch listed each gap and said to stub the screen and tag it, so frontend work never sat waiting on a backend decision.",
  },
  {
    title: "Works without a backend",
    body: "Every list page renders from mock data when no API is configured, so screens could be reviewed and tested before the API behind them was ready.",
  },
];

const filters = [
  {
    title: "Who it’s for",
    body: "Operations staff doing the same lookups all day, not engineers who already know the product. A box that says “Search orders…” doesn’t say which fields it searches. A field labeled “Customer email” does.",
  },
  {
    title: "What research said",
    body: "Baymard and Nielsen Norman Group both found users miss filtering hidden behind a generic control, and non-technical users often don’t recognize a chip as something they can remove.",
  },
  {
    title: "When I’d revisit it",
    body: "If the people using it get more technical, or the API gains multi-field search. Filters come from one config per resource, so moving to chips would change that config, not the screens.",
  },
];

const urlState = [
  {
    title: "What I ruled out",
    body: "Component state, a global store, and route segments. Each one loses the open panel on refresh or needs custom back-button handling.",
  },
  {
    title: "What it costs",
    body: "Which panels close together has to be listed explicitly, and a link with a child panel but no parent has to be caught and corrected.",
  },
];

const keyboard = [
  {
    title: "A tab stop on every row",
    body: "Twenty-five stops to get past one page of results, and a focusable row outside a grid gives screen readers no defined way to present it.",
  },
  {
    title: "A button in every row",
    body: "Reachable by keyboard, but each row becomes its own stop, and the table stops reading as one collection.",
  },
  {
    title: "What I built",
    body: "The WAI-ARIA grid pattern: one tab stop into the table, arrow keys between rows, Enter to open. Closing the panel returns focus to the row you came from.",
  },
];

const built = [
  "Customers",
  "Orders",
  "Support requests",
  "Inventory",
  "Reports",
  "Webhooks",
  "Onboarding",
  "API docs",
  "API playground",
];

const role = [
  { title: "Wrote", body: "the pitch: the problem, the solution area by area, the rabbit holes, and what was out of scope." },
  { title: "Reviewed", body: "it with frontend and backend engineers before any of it was built." },
  { title: "Built", body: "most of the frontend, on Next.js, React, TypeScript, Apollo, and Tailwind." },
  {
    title: "Recorded",
    body: "each real design and architecture choice in a decision log, with the alternatives and what would make me revisit it.",
  },
  {
    title: "Tested",
    body: "accessibility with Playwright and axe-core, including keyboard access, contrast, and reflow.",
  },
];

export default function PartnerPortalPage() {
  return (
    <>
      <PageIntro
        breadcrumb="Partner portal"
        kicker="Case study"
        logo={<EmployerLogo employer="healthwarehouse" labelled className="[--logo-h:2.25rem]" />}
        title="Routine partner work, without an engineer in the loop."
        meta={[
          { label: "Role", value: "Senior Software Engineer" },
          { label: "Focus", value: "Product shaping · UX · Frontend architecture" },
          { label: "Stack", value: "Next.js · React · TypeScript · GraphQL · Tailwind" },
          { label: "Status", value: "In progress" },
        ]}
      />
      <CurveDivider above="gradient-page" below="surface" />

      <NarrativeSection
        kicker="The problem"
        title="Everything went through email."
        body="Pharmacy partners had no tool of their own. Looking up an order, correcting a patient record, pulling a report, or rotating an API key meant emailing support and waiting for someone to query the database. Partners couldn’t check status, requests had no priority or history, and engineers were in the path of routine work."
      >
        <PartnerRequestFlow />
      </NarrativeSection>

      <NarrativeSection
        kicker="Shaping"
        title="A written pitch before any code."
        body="The team shapes work as a written pitch before building it. I wrote this one: the problem, a proposed solution for each area, the rabbit holes, and what was out of scope. Frontend and backend engineers reviewed it before work started."
      >
        <EvidenceGrid items={shaping} />
      </NarrativeSection>

      <NarrativeSection
        id="decision"
        kicker="The key decision"
        title="Labeled filters, not a search box."
        body="Stripe, Linear, and Shopify Admin filter with one search bar and removable chips. I weighed three versions of that pattern and kept plain labeled fields, because of who uses this portal."
      >
        <EvidenceGrid items={filters} />
      </NarrativeSection>

      <NarrativeSection
        id="architecture"
        kicker="Architecture"
        title="Open a record, share the link."
        body="Records open as panels over the list instead of on a new page, so people keep their place. The address bar holds which panels are open."
      >
        <SheetStackDiagram />
        <EvidenceGrid items={urlState} className="mt-space-5" />
      </NarrativeSection>

      <NarrativeSection
        kicker="The hard part"
        title="Rows you could click but not reach."
        body="Every list opened a record when you clicked a row, and none of that worked from a keyboard. The two quick fixes were both wrong."
      >
        <EvidenceGrid items={keyboard} />
      </NarrativeSection>

      <NarrativeSection
        kicker="Where it stands"
        title="Still being built."
        body="Screens for every area in the pitch exist but one. API keys, and the choice of a multi-factor sign-in provider, wait on decisions the pitch flagged at the start."
      >
        <h3 className={`text-ink ${textH4}`}>Areas with working screens</h3>
        <div className="mt-space-3">
          <DetailGrid items={built} />
        </div>
      </NarrativeSection>

      <NarrativeSection kicker="Role" title="What I actually did">
        <TileList items={role} accent />
      </NarrativeSection>

      <CurveDivider above="surface" below="primary" />
    </>
  );
}
