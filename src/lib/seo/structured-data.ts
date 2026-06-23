/** Builders for JSON-LD structured data injected via the Seo component. */

import { SITE } from "@/constants/site"

/** Schema.org `WebSite` node describing the app as a whole. */
export function buildWebSiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    description: SITE.description,
    url: siteUrl,
  }
}

/** Schema.org `BreadcrumbList` from ordered { name, url } crumbs. */
export function buildBreadcrumbJsonLd(
  crumbs: ReadonlyArray<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}
