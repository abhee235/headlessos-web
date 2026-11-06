// Where a docs page sits: Docs, its sidebar group, then the page. The header's breadcrumbs and
// the search-engine data both read this, so they can't disagree.

interface SidebarEntry {
  type: "link" | "group";
  label: string;
  href?: string;
  isCurrent?: boolean;
  entries?: SidebarEntry[];
}

export interface TrailStep {
  label: string;
  href?: string;
}

function find(entries: SidebarEntry[], path: TrailStep[]): TrailStep[] | null {
  for (const entry of entries) {
    if (entry.type === "link" && entry.isCurrent) return [...path, { label: entry.label }];
    if (entry.type === "group" && entry.entries) {
      const found = find(entry.entries, [...path, { label: entry.label }]);
      if (found) return found;
    }
  }
  return null;
}

/** The steps to the current page. Empty on the docs home, which needs none. */
export function docsTrail(sidebar: SidebarEntry[]): TrailStep[] {
  const steps = find(sidebar, []);
  if (!steps || steps.at(-1)?.label === "Docs home") return [];
  return [{ label: "Docs", href: "/docs" }, ...steps];
}
