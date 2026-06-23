/** Declarative navigation model shared by the sidebar and bottom nav. */

import type { IconType } from "react-icons"
import {
  RiBookmarkFill,
  RiBookmarkLine,
  RiCompass3Fill,
  RiCompass3Line,
  RiSearch2Fill,
  RiSearch2Line,
} from "react-icons/ri"

import { ROUTE_PATHS } from "@/constants/routes"

export interface NavItem {
  label: string
  to: string
  icon: IconType
  activeIcon: IconType
  /** Require an exact path match to be considered active. */
  end?: boolean
}

export const PRIMARY_NAV: readonly NavItem[] = [
  {
    label: "Discover",
    to: ROUTE_PATHS.home,
    icon: RiCompass3Line,
    activeIcon: RiCompass3Fill,
    end: true,
  },
  {
    label: "Browse",
    to: ROUTE_PATHS.browse,
    icon: RiSearch2Line,
    activeIcon: RiSearch2Fill,
  },
  {
    label: "Library",
    to: ROUTE_PATHS.library,
    icon: RiBookmarkLine,
    activeIcon: RiBookmarkFill,
  },
] as const
