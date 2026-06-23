import { PRIMARY_NAV } from "@/constants/navigation"

import { NavLink } from "./NavLink"

/** Fixed bottom tab bar shown on mobile/tablet (mobile-first chrome). */
export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card lg:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {PRIMARY_NAV.map((item) => (
          <li key={item.to + item.label}>
            <NavLink item={item} variant="bottom" />
          </li>
        ))}
      </ul>
    </nav>
  )
}
