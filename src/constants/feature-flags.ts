/**
 * Feature flags. Env-driven flags read from the typed {@link ENV}; static
 * flags flip behaviour at build time. Gate new/experimental work behind a flag
 * rather than commenting code out.
 */

import { ENV } from "@/config/env"

export const FEATURE_FLAGS = {
  /** Wire up analytics providers (env-driven). */
  analytics: ENV.enableAnalytics,
  /** Show the curated subject shelves on the Discover page. */
  discoverShelves: true,
  /** Show the average-rating badge on book cards. */
  bookRatings: true,
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag]
}
