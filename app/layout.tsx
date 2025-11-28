import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "PromptForge - Professional AI Prompt Generator",
  description: "Create structured, high-quality prompts for general tasks and coding with PromptForge. 100% free, browser-based prompt generator for GPT, Claude, Copilot, and more.",
  generator: "Next.js",
  keywords: ["AI prompts", "prompt generator", "GPT prompts", "Claude prompts", "coding prompts", "prompt engineering"],
  authors: [{ name: "PromptForge" }],
  openGraph: {
    title: "PromptForge - Professional AI Prompt Generator",
    description: "Create structured, high-quality prompts for general tasks and coding. 100% free, browser-based prompt generator.",
    type: "website",
    locale: "en_US",
    siteName: "PromptForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge - Professional AI Prompt Generator",
    description: "Create structured, high-quality prompts for general tasks and coding.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
