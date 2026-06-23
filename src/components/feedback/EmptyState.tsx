import * as React from "react"

import { UI_LABELS } from "@/constants/ui-labels"
import { cn } from "@/lib/utils"

import { NoResultsArt } from "./EmptyStateArt"

interface EmptyStateProps {
  title?: string
  description?: string
  /** Line-art SVG illustration. Defaults to the "no results" magnifier. */
  illustration?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = UI_LABELS.states.empty,
  description,
  illustration,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-14 text-center",
        className
      )}
    >
      <div className="text-foreground/85">
        {illustration ?? <NoResultsArt />}
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl md:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
