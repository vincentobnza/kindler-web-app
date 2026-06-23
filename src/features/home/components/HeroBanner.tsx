import { useState } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { RiSearchLine } from "react-icons/ri"
import { RxRocket } from "react-icons/rx"
import { useNavigate } from "react-router-dom"

import { buildPath } from "@/constants/routes"
import { SITE } from "@/constants/site"
import { UI_LABELS } from "@/constants/ui-labels"
import { useTypewriter } from "@/lib/hooks/useTypewriter"
import { Input } from "@/components/ui/input"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

/** Example searches the placeholder cycles through. */
const PLACEHOLDER_PHRASES = [
  "Dune",
  "Pride and Prejudice",
  "The Hobbit",
  "Ursula K. Le Guin",
  "mystery novels",
  "poetry",
] as const

/** Elegant, animated Discover hero with a primary search entry point. */
export function HeroBanner() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState("")

  // Cycle the placeholder while the field is empty (paused once the user types).
  const typed = useTypewriter(PLACEHOLDER_PHRASES, {
    active: query.length === 0,
  })

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const q = query.trim()
    navigate(
      q
        ? `${buildPath.browse()}?q=${encodeURIComponent(q)}`
        : buildPath.browse()
    )
  }

  const item: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: "easeOut" },
        },
      }

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative isolate -mx-4 overflow-hidden px-4 py-20 sm:mx-0 sm:px-0 sm:py-28"
    >
      <div className="mx-auto max-w-2xl space-y-5 text-center">
        <motion.span
          variants={item}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          <RxRocket className="size-3" />
          Powered by the Open Library
        </motion.span>

        <motion.h1
          variants={item}
          className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl"
        >
          {SITE.tagline.split(SITE.taglineEmphasis)[0]}
          <em className="italic">{SITE.taglineEmphasis}</em>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-pretty text-muted-foreground sm:text-lg"
        >
          {SITE.description}
        </motion.p>

        <motion.form
          variants={item}
          onSubmit={handleSubmit}
          className="relative mx-auto max-w-2xl"
          role="search"
        >
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search “${typed}”`}
            aria-label={UI_LABELS.actions.search}
            className="h-12 rounded-full pr-13 pl-5 font-heading! text-base shadow-2xl shadow-neutral-200 placeholder:font-heading! sm:text-lg"
          />
          <button
            type="submit"
            aria-label={UI_LABELS.actions.search}
            className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <RiSearchLine className="size-4" />
          </button>
        </motion.form>
      </div>
    </motion.section>
  )
}
