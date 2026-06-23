/** Small, pure string formatters. Pure functions → trivially unit-testable. */

// Unicode combining diacritical marks (U+0300–U+036F), stripped after NFD
// normalisation so "José" matches "jose". Built from escapes to keep the
// source file ASCII-clean.
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g")

/** Derives up-to-two uppercase initials from a name (for avatar fallbacks). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Truncates to `max` characters, appending an ellipsis when shortened. */
export function truncate(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`
}

/** Normalises a string for case-insensitive, accent-tolerant matching. */
export function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .trim()
}
