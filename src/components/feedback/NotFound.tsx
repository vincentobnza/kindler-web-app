import { Link } from "react-router-dom"

import { ROUTE_PATHS } from "@/constants/routes"
import { UI_LABELS } from "@/constants/ui-labels"
import { Button } from "@/components/ui/button"

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-bold tracking-tight text-muted-foreground/40">
        404
      </p>
      <h1 className="text-xl font-semibold text-foreground">
        {UI_LABELS.states.notFound}
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {UI_LABELS.feedback.notFoundBody}
      </p>
      <Button asChild className="mt-2">
        <Link to={ROUTE_PATHS.home}>Back to home</Link>
      </Button>
    </div>
  )
}
