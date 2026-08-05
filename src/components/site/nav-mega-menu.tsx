import Link from "next/link";

interface MegaMenuItem {
  href: string;
  title: string;
  subtitle: string;
}

/** Pure CSS hover (no JS state) — nothing here can hydration-mismatch, and
 * there's no click-outside/focus logic to get wrong. `.pt-nav-item:hover
 * .pt-mega-menu` in legacy-theme.css does all the showing/hiding. */
export function NavMegaMenu({
  label,
  href,
  active,
  items,
  viewAllHref,
  viewAllLabel,
}: {
  label: string;
  href: string;
  active: boolean;
  items: MegaMenuItem[];
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <li className="pt-nav-item">
      <Link href={href} className={`pt-nav-link pt-nav-link-caret${active ? " active" : ""}`}>
        {label}
        <i className="fa-solid fa-chevron-down" />
      </Link>
      <div className="pt-mega-menu">
        {items.length === 0 ? (
          <p className="pt-mega-menu-empty">Nothing to show yet — check back soon.</p>
        ) : (
          <div className="pt-mega-menu-grid">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="pt-mega-menu-item-title">{item.title}</div>
                <div className="pt-mega-menu-item-subtitle">{item.subtitle}</div>
              </Link>
            ))}
          </div>
        )}
        <Link href={viewAllHref} className="pt-mega-menu-viewall">
          {viewAllLabel} &rarr;
        </Link>
      </div>
    </li>
  );
}
