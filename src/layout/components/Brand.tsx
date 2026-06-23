import { Link } from "react-router-dom"

import { ROUTE_PATHS } from "@/constants/routes"
import { SITE } from "@/constants/site"
import { cn } from "@/lib/utils"

/** App wordmark + icon, linking home. */
export function Brand({ className }: { className?: string }) {
  return (
    <Link
      to={ROUTE_PATHS.home}
      className={cn(
        "inline-flex items-center gap-2 text-foreground",
        className
      )}
    >
      <span className="font-heading text-lg font-semibold tracking-tight italic sm:text-xl md:text-2xl lg:text-3xl">
        {SITE.name}.
      </span>
    </Link>
  )
}
