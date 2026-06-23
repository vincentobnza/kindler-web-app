import { PRIMARY_NAV } from "@/constants/navigation"
import { Container } from "@/components/common/Container"

import { Brand } from "./Brand"
import { NavLink } from "./NavLink"

/**
 * Sticky top navigation. Brand on the left; inline links on the right for
 * desktop. On mobile the links live in the fixed bottom nav, so the header
 * carries only the wordmark.
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Brand />
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to + item.label} item={item} variant="top" />
          ))}
        </nav>
      </Container>
    </header>
  )
}
