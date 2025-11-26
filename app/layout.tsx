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
      <head>
        {/* Resource hints for better performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inline critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{__html: `
          .antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
          .bg-background{background-color:var(--background)}
          .text-foreground{color:var(--foreground)}
          .font-sans{font-family:var(--font-sans)}
          .min-h-screen{min-height:100vh}
          .backdrop-blur-xl{backdrop-filter:blur(24px)}
          .border-white\\/20{border-color:rgba(255,255,255,0.2)}
          .bg-white\\/70{background-color:rgba(255,255,255,0.7)}
          .dark .bg-black\\/40{background-color:rgba(0,0,0,0.4)}
          .sticky{position:sticky}
          .top-0{top:0}
          .z-50{z-index:50}
          .shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}
        `}} />
      </head>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
