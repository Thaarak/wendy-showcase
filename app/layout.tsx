import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { WendyStateProvider } from "./context/wendy-context"


export const metadata: Metadata = {
  title: "Wendy | Wedding planning assistant",
  description: "Your AI-powered wedding planning assistant",
    icons: { icon: "/wendy.svg" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WendyStateProvider>{children}</WendyStateProvider>
      </body>
    </html>
  )
}
