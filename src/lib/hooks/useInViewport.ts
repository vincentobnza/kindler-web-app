import { useEffect, useRef, useState } from "react"

interface UseInViewportOptions {
  /**
   * Margin grown around the viewport before intersection is reported, so work
   * (e.g. an image fetch) can start *before* the element scrolls into view.
   * Accepts any CSS margin string, e.g. "200px".
   */
  rootMargin?: string
  /** Stop observing once the element has entered the viewport. Defaults to true. */
  once?: boolean
}

/**
 * Tracks whether the referenced element is in (or near) the viewport via an
 * `IntersectionObserver`. Attach the returned `ref` to a DOM node and read
 * `inView`. When the browser lacks `IntersectionObserver` (e.g. jsdom, very old
 * browsers), it reports `true` immediately so content still renders.
 */
export function useInViewport<T extends Element = HTMLElement>({
  rootMargin = "200px",
  once = true,
}: UseInViewportOptions = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined"
  )

  useEffect(() => {
    const element = ref.current
    if (!element || inView) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, once, inView])

  return { ref, inView }
}
