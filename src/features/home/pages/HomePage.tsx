import { ENV } from "@/config/env"
import { FEATURE_FLAGS } from "@/constants/feature-flags"
import { buildPath } from "@/constants/routes"
import { buildWebSiteJsonLd } from "@/lib/seo/structured-data"
import { Seo } from "@/components/seo/Seo"
import { BookShelf } from "@/features/books/components/BookShelf"
import { DISCOVER_SHELVES } from "@/features/books/constants/discover"

import { HeroBanner } from "../components/HeroBanner"

export function HomePage() {
  return (
    <div className="space-y-12">
      <Seo path={buildPath.home()} jsonLd={buildWebSiteJsonLd(ENV.siteUrl)} />

      <HeroBanner />

      {FEATURE_FLAGS.discoverShelves
        ? DISCOVER_SHELVES.map((shelf) => (
            <BookShelf key={shelf.subject} shelf={shelf} />
          ))
        : null}
    </div>
  )
}
