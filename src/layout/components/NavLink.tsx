import { NavLink as RouterNavLink } from "react-router-dom"

import type { NavItem } from "@/constants/navigation"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  item: NavItem
  /** "top" = inline text link (desktop header); "bottom" = stacked icon + label. */
  variant?: "top" | "bottom"
}

/**
 * Router-aware nav link with an active state. The bottom (mobile) variant swaps
 * to the filled icon; the top (desktop) variant is a clean editorial text link.
 */
export function NavLink({ item, variant = "top" }: NavLinkProps) {
  return (
    <RouterNavLink
      to={item.to}
      end={item.end}
      className="group/navlink outline-none"
    >
      {({ isActive }) => {
        if (variant === "bottom") {
          const Icon = isActive ? item.activeIcon : item.icon
          return (
            <span
              className={cn(
                "flex flex-col items-center gap-0.5 text-[0.7rem] font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground group-hover/navlink:text-foreground"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </span>
          )
        }
        return (
          <span
            className={cn(
              "text-sm font-medium tracking-tight transition-colors",
              isActive
                ? "text-foreground underline decoration-2 underline-offset-8"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </span>
        )
      }}
    </RouterNavLink>
  )
}
