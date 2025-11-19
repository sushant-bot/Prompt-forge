import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PromptForge - Professional Prompt Generator",
  description: "Create structured, high-quality prompts for general tasks and coding with PromptForge. 100% free, browser-based prompt generator.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="font-sans">{children}</body>
    </html>
  )
}
