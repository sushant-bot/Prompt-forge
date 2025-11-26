"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Moon, Sun, Copy, Sparkles, BookTemplate, LogIn, LogOut, 
  Menu, History, Zap
} from 'lucide-react'

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
  user: any
  loading: boolean
  signOut: () => void
  setIsAuthDialogOpen: (open: boolean) => void
  setIsTemplateLibraryOpen: (open: boolean) => void
  copyPrompt: () => void
  generatedPrompt: string
  mounted: boolean
  selectedModel: string
  setSelectedModel: (model: string) => void
}

const AI_MODELS = [
  { value: "gpt-4", label: "GPT-4", icon: "🤖" },
  { value: "gpt-3.5", label: "GPT-3.5", icon: "🤖" },
  { value: "claude-3", label: "Claude 3", icon: "🧠" },
  { value: "gemini", label: "Gemini Pro", icon: "✨" },
  { value: "copilot", label: "GitHub Copilot", icon: "💻" },
  { value: "custom", label: "Custom", icon: "⚙️" },
]

export function Header({
  darkMode,
  toggleDarkMode,
  user,
  loading,
  signOut,
  setIsAuthDialogOpen,
  setIsTemplateLibraryOpen,
  copyPrompt,
  generatedPrompt,
  mounted,
  selectedModel,
  setSelectedModel,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header 
      className="border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-50 shadow-md"
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative shrink-0">
              <div 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-linear-to-br from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg"
                role="img"
                aria-label="PromptForge logo"
              >
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold bg-linear-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tight truncate">
                PromptForge
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium hidden sm:block">
                Craft AI Prompts with Precision ✨
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Model Selector */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger 
                className="w-40 h-10 rounded-full bg-white/50 dark:bg-black/30 border-white/20 hover:bg-white/70 dark:hover:bg-black/50"
                aria-label="Select AI model"
              >
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <span className="flex items-center gap-2">
                      <span>{model.icon}</span>
                      <span>{model.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Quick Actions */}
            <Button 
              variant="ghost" 
              onClick={() => setIsTemplateLibraryOpen(true)}
              className="rounded-full h-10 px-4 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md gap-2"
              aria-label="Open template library"
            >
              <BookTemplate className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Templates</span>
            </Button>

            <Button 
              variant="ghost" 
              onClick={copyPrompt}
              disabled={!generatedPrompt}
              className="rounded-full h-10 px-4 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md gap-2 disabled:opacity-50"
              aria-label="Copy generated prompt"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Copy</span>
            </Button>

            {/* Auth Button */}
            {mounted && user ? (
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="rounded-full h-10 px-4 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md gap-2"
                aria-label={`Sign out ${user.email}`}
              >
                <span className="text-sm font-medium max-w-[100px] truncate">
                  {user.email?.split('@')[0]}
                </span>
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              mounted && !loading && (
                <Button
                  variant="ghost"
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="rounded-full h-10 px-4 bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-none backdrop-blur-md gap-2 shadow-lg"
                  aria-label="Sign in to your account"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Sign In</span>
                </Button>
              )
            )}

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode} 
              className="rounded-full h-10 w-10 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" aria-hidden="true" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme Toggle - Always visible on mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode} 
              className="rounded-full h-10 w-10 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" aria-hidden="true" />
              )}
            </Button>

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-black/95 backdrop-blur-xl"
                aria-label="Navigation menu"
              >
                <nav className="flex flex-col gap-4 mt-8" role="navigation">
                  <h2 className="text-lg font-semibold mb-2">Navigation</h2>
                  
                  {/* Model Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="mobile-model-select">
                      AI Model
                    </label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger id="mobile-model-select" className="w-full">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            <span className="flex items-center gap-2">
                              <span>{model.icon}</span>
                              <span>{model.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2 pt-4 border-t border-white/20">
                    <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setIsTemplateLibraryOpen(true)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <BookTemplate className="h-4 w-4" aria-hidden="true" />
                      <span>Browse Templates</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        copyPrompt()
                        setMobileMenuOpen(false)
                      }}
                      disabled={!generatedPrompt}
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>Copy Prompt</span>
                    </Button>
                  </div>

                  {/* Auth Section */}
                  <div className="space-y-2 pt-4 border-t border-white/20">
                    {mounted && user ? (
                      <>
                        <div className="text-sm text-muted-foreground mb-2">
                          Signed in as <span className="font-medium">{user.email}</span>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            signOut()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          <span>Sign Out</span>
                        </Button>
                      </>
                    ) : (
                      mounted && !loading && (
                        <Button
                          className="w-full justify-start gap-2 bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                          onClick={() => {
                            setIsAuthDialogOpen(true)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogIn className="h-4 w-4" aria-hidden="true" />
                          <span>Sign In</span>
                        </Button>
                      )
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/50 dark:bg-black/30 mt-4">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                    <span className="text-sm font-medium">System Ready</span>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
