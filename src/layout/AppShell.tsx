import { Outlet, ScrollRestoration } from "react-router-dom"

import { Container } from "@/components/common/Container"

import { BottomNav } from "./components/BottomNav"
import { Footer } from "./components/Footer"
import { TopBar } from "./components/TopBar"

/** The persistent application chrome wrapping every route. */
export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ScrollRestoration />

      {/* Centered max-w-5xl column, framed by hairline borders on both sides.
          Keeping the chrome inside it constrains the top bar and footer to the
          same width as the page content. */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col border-x border-border">
        <TopBar />

        <main className="flex-1 py-8 sm:py-12">
          <Container>
            <Outlet />
          </Container>
        </main>

        <Footer />
      </div>

      {/* Spacer so content clears the fixed bottom nav on mobile. */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <BottomNav />
    </div>
  )
}
