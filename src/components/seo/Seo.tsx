import { Helmet } from "react-helmet-async"

import { ENV } from "@/config/env"
import { toAbsoluteUrl } from "@/constants/routes"
import { SITE } from "@/constants/site"

interface SeoProps {
  title?: string
  description?: string
  /** Absolute path (e.g. "/users") used for the canonical + OG URL. */
  path?: string
  noIndex?: boolean
  /** Optional JSON-LD object(s) injected as <script type="application/ld+json">. */
  jsonLd?: object | object[]
}

/**
 * Per-route document head: title, description, canonical, Open Graph / Twitter
 * cards and optional JSON-LD. Renders nothing visible; relies on the
 * HelmetProvider mounted in app/providers.
 */
export function Seo({ title, description, path, noIndex, jsonLd }: SeoProps) {
  const fullTitle = title
    ? `${title} · ${SITE.name}`
    : `${SITE.name} · ${SITE.tagline}`
  const desc = description ?? SITE.description
  const canonical = path ? toAbsoluteUrl(ENV.siteUrl, path) : ENV.siteUrl
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />

      {blocks.map((block, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}
