import { textH4, textH5 } from "@/lib/type";

type Node = { role: string; name: string; children?: Node[] };

// The cart drawer as a screen reader met it, before and after one fix. Taken
// from the fix's commit; the missing label was an `aria-labelledby` pointing
// at an id nothing carried.
const before: Node = {
  role: "dialog",
  name: "“Shopping cart”",
  children: [
    {
      role: "dialog",
      name: "no name",
      children: [
        { role: "dialog", name: "“Your Shopping Cart”" },
        { role: "dialog", name: "named by a label that doesn’t exist" },
      ],
    },
  ],
};

const after: Node = {
  role: "dialog",
  name: "“Shopping cart”",
  children: [{ role: "", name: "the cart’s heading and items" }],
};

function Tree({ node }: { node: Node }) {
  return (
    <li>
      <p className="flex flex-wrap items-baseline gap-x-space-1 text-body text-ink/72">
        {node.role ? <span className="rounded-pill border border-ink/20 px-space-1 text-label leading-6 text-ink">{node.role}</span> : null}
        {node.name}
      </p>
      {node.children ? (
        <ul className="mt-space-1 grid gap-space-1 border-l border-ink/15 pl-space-2">
          {node.children.map((child, i) => (
            <Tree key={i} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/**
 * HealthWarehouse evidence: one accessibility fix shown as the roles a
 * screen reader was given, before and after. Real text throughout, so the
 * example reads the same aloud as on screen.
 */
export function DialogFixExample() {
  return (
    <figure aria-labelledby="dialog-fix-caption">
      <h3 className={`text-ink ${textH4}`}>The cart drawer, before and after</h3>
      <div className="mt-space-3 grid gap-space-3 sm:grid-cols-2">
        <div className="rounded-lg border border-ink/15 bg-surface p-space-2 sm:p-space-3">
          <p className={`text-ink ${textH5}`}>Before: four dialogs for one drawer</p>
          <ul aria-label="Before" className="mt-space-2">
            <Tree node={before} />
          </ul>
        </div>
        <div className="rounded-lg border border-accent bg-surface p-space-2 sm:p-space-3">
          <p className={`text-ink ${textH5}`}>After: one dialog, named once</p>
          <ul aria-label="After" className="mt-space-2">
            <Tree node={after} />
          </ul>
        </div>
      </div>
      <figcaption id="dialog-fix-caption" className="mt-space-3 max-w-xl text-body text-ink/72">
        The shopping cart drawer, as a screen reader was told about it. The add-to-cart state, with
        this drawer open, is scanned by axe-core in five browser and device profiles.
      </figcaption>
    </figure>
  );
}
