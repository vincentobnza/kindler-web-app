import { RiErrorWarningFill, RiRefreshLine } from "react-icons/ri"

import { UI_LABELS } from "@/constants/ui-labels"
import { ApiError } from "@/lib/http/api-error"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  title?: string
  description?: string
  error?: unknown
  onRetry?: () => void
  className?: string
}

function describeError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.isNotFound) return UI_LABELS.feedback.notFoundBody
    if (error.isNetworkError) return UI_LABELS.feedback.networkError
    return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

export function ErrorState({
  title = UI_LABELS.states.error,
  description,
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const message =
    description ?? describeError(error, "An unexpected error occurred.")

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <RiErrorWarningFill className="size-6" />
      </span>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="-mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RiRefreshLine />
          {UI_LABELS.actions.retry}
        </Button>
      ) : null}
    </div>
  )
}
