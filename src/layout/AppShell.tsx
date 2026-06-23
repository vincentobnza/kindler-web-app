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
      <TopBar />

      <main className="flex-1 py-8 sm:py-12">
        <Container>
          <Outlet />
        </Container>
      </main>

      <Footer />

      {/* Spacer so content clears the fixed bottom nav on mobile. */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <BottomNav />
    </div>
  )
}
