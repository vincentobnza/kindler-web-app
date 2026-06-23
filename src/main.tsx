import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { AppProviders } from "@/app/providers"
import { createQueryClient } from "@/app/query-client"
import { createAppRouter } from "@/app/router"

import "./index.css"

const queryClient = createQueryClient()
const router = createAppRouter(queryClient)

const rootElement = document.getElementById("root")
if (!rootElement) {
  throw new Error("Root element #root was not found")
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
)
