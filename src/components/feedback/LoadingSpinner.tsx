import { UI_LABELS } from "@/constants/ui-labels"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  label?: string
}

const BOXES = [0, 1, 2]

/**
 * Pixel-style loader: three ink boxes that rise and brighten in sequence,
 * stacked above an optional label. Honours `prefers-reduced-motion` via the
 * global motion reset in index.css.
 */
export function LoadingSpinner({ className, label }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center gap-3", className)}
    >
      <div className="flex items-end gap-1.5">
        {BOXES.map((index) => (
          <span
            key={index}
            className="size-3 bg-foreground"
            style={{
              animation: "pixel-bounce 0.9s ease-in-out infinite",
              animationDelay: `${index * 0.15}s`,
            }}
          />
        ))}
      </div>
      {label ? (
        <span className="font-heading text-sm font-bold text-muted-foreground sm:text-base md:text-lg lg:text-2xl">
          {label}
        </span>
      ) : null}
      <span className="sr-only">{label ?? UI_LABELS.states.loading}</span>
    </div>
  )
}
