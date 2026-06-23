import { SITE } from "@/constants/site"
import { Container } from "@/components/common/Container"

export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <Container className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
        <p>
          {new Date().getFullYear()} &copy; {SITE.name}. All rights reserved.
        </p>
        <p>
          {SITE.name} — {SITE.tagline.split(SITE.taglineEmphasis)[0]}
          <em className="italic">{SITE.taglineEmphasis}</em>
        </p>
      </Container>
    </footer>
  )
}
