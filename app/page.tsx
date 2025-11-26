"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Copy, Trash2, Sparkles, MessageSquare, Code2, CheckCircle2, BookTemplate, LogIn, LogOut, Cloud, CloudOff, User } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { GeneralModeForm } from "@/components/prompt-forge/general-mode-form"
import { CodingModeForm } from "@/components/prompt-forge/coding-mode-form"
import { PromptPreview } from "@/components/prompt-forge/prompt-preview"
import { generateGeneralPrompt, generateCodingPrompt, type GeneralPromptParams, type CodingPromptParams } from "@/lib/prompt-generator"
import type { PromptTemplate } from "@/lib/templates"
import { saveToHistory, type HistoryItem } from "@/lib/history"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { useAuth } from "@/contexts/auth-context"

// Lazy load heavy components with dynamic imports for better performance
const TemplateLibrary = dynamic(
  () => import("@/components/prompt-forge/template-library").then(mod => ({ default: mod.TemplateLibrary })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false,
  }
)

const PromptHistory = dynamic(
  () => import("@/components/prompt-forge/prompt-history").then(mod => ({ default: mod.PromptHistory })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false,
  }
)

export default function PromptForgePage() {
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const { toast } = useToast()
  const { user, loading, signOut } = useAuth()
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)

  // General mode fields
  const [persona, setPersona] = useState("")
  const [useCase, setUseCase] = useState("")
  const [tone, setTone] = useState("")
  const [outputFormat, setOutputFormat] = useState("")
  const [topic, setTopic] = useState("")
  const [constraints, setConstraints] = useState("")

  // Coding mode additional fields
  const [language, setLanguage] = useState("")
  const [codeSnippet, setCodeSnippet] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Generated prompt
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Template library
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false)

  // History trigger for re-rendering
  const [historyUpdateTrigger, setHistoryUpdateTrigger] = useState(0)

  // Load dark mode preference from localStorage and mark as mounted
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  // Debounced live preview update
  useEffect(() => {
    const timer = setTimeout(() => {
      updateLivePreview()
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [persona, useCase, tone, outputFormat, topic, constraints, language, codeSnippet, errorMessage, activeTab])

  const updateLivePreview = useCallback(() => {
    // Only update if there's meaningful content
    if (!topic && !persona && !useCase) {
      setGeneratedPrompt("")
      return
    }

    let prompt = ""
    
    if (activeTab === "general") {
      const params: GeneralPromptParams = {
        persona,
        useCase,
        tone,
        outputFormat,
        topic,
        constraints
      }
      prompt = generateGeneralPrompt(params)
    } else {
      const params: CodingPromptParams = {
        persona,
        useCase,
        tone,
        outputFormat,
        topic,
        constraints,
        language,
        codeSnippet,
        errorMessage
      }
      prompt = generateCodingPrompt(params)
    }

    setGeneratedPrompt(prompt)
  }, [activeTab, persona, useCase, tone, outputFormat, topic, constraints, language, codeSnippet, errorMessage])

  const generatePrompt = () => {
    setIsGenerating(true)
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      updateLivePreview()
      setIsGenerating(false)
      
      // Save to history if there's a valid prompt
      if (generatedPrompt && (topic || persona || useCase)) {
        try {
          saveToHistory({
            mode: activeTab as 'general' | 'coding',
            prompt: generatedPrompt,
            metadata: {
              persona,
              useCase,
              tone,
              outputFormat,
              topic,
              language: activeTab === 'coding' ? language : undefined
            }
          })
          setHistoryUpdateTrigger(prev => prev + 1)
        } catch (error) {
          console.error('Failed to save to history:', error)
        }
      }
      
      toast({
        title: "✨ Prompt Generated!",
        description: "Your optimized prompt is ready.",
      })
    }, 800)
  }

  const copyPrompt = async () => {
    if (!generatedPrompt) {
      toast({
        title: "No prompt to copy",
        description: "Generate a prompt first.",
        variant: "destructive",
      })
      return
    }

    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast({
        title: "✓ Copied!",
        description: "Prompt copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearAll = () => {
    setPersona("")
    setUseCase("")
    setTone("")
    setOutputFormat("")
    setTopic("")
    setConstraints("")
    setLanguage("")
    setCodeSnippet("")
    setErrorMessage("")
    setGeneratedPrompt("")
    toast({
      title: "Cleared",
      description: "All fields have been reset.",
    })
  }

  const loadTemplate = (template: PromptTemplate) => {
    // Switch to the appropriate tab
    setActiveTab(template.mode)
    
    // Load template data
    setPersona(template.data.persona || "")
    setUseCase(template.data.useCase || "")
    setTone(template.data.tone || "")
    setOutputFormat(template.data.outputFormat || "")
    setTopic(template.data.topic || "")
    setConstraints(template.data.constraints || "")
    
    // Load coding-specific fields if applicable
    if (template.mode === 'coding') {
      setLanguage(template.data.language || "")
      setCodeSnippet(template.data.codeSnippet || "")
      setErrorMessage(template.data.errorMessage || "")
    }
    
    toast({
      title: "Template Loaded",
      description: `"${template.name}" has been loaded into the form.`,
    })
  }

  const restoreFromHistory = (item: HistoryItem) => {
    // Switch to the appropriate tab
    setActiveTab(item.mode)
    
    // Restore metadata
    setPersona(item.metadata.persona || "")
    setUseCase(item.metadata.useCase || "")
    setTone(item.metadata.tone || "")
    setOutputFormat(item.metadata.outputFormat || "")
    setTopic(item.metadata.topic || "")
    
    // Restore coding-specific fields if applicable
    if (item.mode === 'coding' && item.metadata.language) {
      setLanguage(item.metadata.language)
    }
    
    // Set the generated prompt
    setGeneratedPrompt(item.prompt)
    
    toast({
      title: "History Restored",
      description: "Prompt has been restored from history.",
    })
  }

  return (
    <motion.div 
      className={`min-h-screen ${darkMode ? "dark" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Optimized gradient background - simpler for better paint performance */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: 'radial-gradient(125% 125% at 50% 100%, rgba(245,87,2,0.3) 0%, rgba(238,174,202,0.4) 50%, rgba(148,201,233,0.5) 100%)'
        }}
      />

      {/* Overlay for better text readability */}
      <div className="min-h-screen transition-colors bg-white/10 dark:bg-black/20 backdrop-blur-[1px]">
        {/* Header - optimized shadows */}
        <header className="border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-50 shadow-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl blur-lg opacity-60"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="relative h-12 w-12 rounded-2xl bg-linear-to-br from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center shadow-xl cursor-pointer"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <Sparkles className="h-6 w-6 text-white" />
                  </motion.div>
                </motion.div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold bg-linear-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                    Promptify
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Craft AI Prompts with Precision ✨
                  </p>
                </div>
              </motion.div>

              {/* Navigation & Actions */}
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-md border border-white/20"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Ready
                    </span>
                  </div>
                </motion.div>
                
                {mounted && user ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.22 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => signOut()}
                      className="rounded-full h-10 px-4 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md gap-2"
                    >
                      <span className="text-sm font-medium hidden sm:inline">{user.email?.split('@')[0]}</span>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  mounted && !loading && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.22 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => setIsAuthDialogOpen(true)}
                        className="rounded-full h-10 px-4 bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-none backdrop-blur-md gap-2 shadow-lg"
                      >
                        <LogIn className="h-4 w-4" />
                        <span className="text-sm font-medium hidden sm:inline">Sign In</span>
                      </Button>
                    </motion.div>
                  )
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsTemplateLibraryOpen(true)}
                    className="rounded-full h-10 px-4 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md gap-2"
                  >
                    <BookTemplate className="h-4 w-4" />
                    <span className="text-sm font-medium hidden sm:inline">Templates</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleDarkMode} 
                    className="rounded-full h-10 w-10 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md"
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: darkMode ? 180 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          <motion.div 
            className="max-w-7xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-2">Create Professional Prompts</h2>
            <p className="text-white/80 text-lg">Build optimized prompts for any AI model with our intuitive tools</p>
          </motion.div>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input Forms */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl">
                  <TabsTrigger 
                    value="general" 
                    className="data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2.5 gap-2 font-semibold transition-all duration-300 hover:scale-[1.02]"
                  >
                    <MessageSquare className="h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger 
                    value="coding" 
                    className="data-[state=active]:bg-linear-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2.5 gap-2 font-semibold transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Code2 className="h-4 w-4" />
                    Coding
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <GeneralModeForm
                    persona={persona}
                    setPersona={setPersona}
                    useCase={useCase}
                    setUseCase={setUseCase}
                    tone={tone}
                    setTone={setTone}
                    outputFormat={outputFormat}
                    setOutputFormat={setOutputFormat}
                    topic={topic}
                    setTopic={setTopic}
                    constraints={constraints}
                    setConstraints={setConstraints}
                  />
                  </motion.div>
                </TabsContent>

                <TabsContent value="coding" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <CodingModeForm
                    persona={persona}
                    setPersona={setPersona}
                    useCase={useCase}
                    setUseCase={setUseCase}
                    tone={tone}
                    setTone={setTone}
                    outputFormat={outputFormat}
                    setOutputFormat={setOutputFormat}
                    topic={topic}
                    setTopic={setTopic}
                    constraints={constraints}
                    setConstraints={setConstraints}
                    language={language}
                    setLanguage={setLanguage}
                    codeSnippet={codeSnippet}
                    setCodeSnippet={setCodeSnippet}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                  />
                  </motion.div>
                </TabsContent>
              </Tabs>

              {/* Template Library Button */}
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Button 
                  onClick={() => setIsTemplateLibraryOpen(true)}
                  variant="outline"
                  className="w-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-white/20 hover:bg-white dark:hover:bg-white/10 h-12 gap-2"
                  size="lg"
                >
                  <BookTemplate className="h-5 w-5" />
                  <span>Browse Templates</span>
                  <span className="ml-auto text-xs text-muted-foreground">Study, Viva, Coding & More</span>
                </Button>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Button 
                  onClick={generatePrompt} 
                  disabled={isGenerating}
                  className="flex-1 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/30 h-12 text-base font-semibold hover:scale-105 transition-transform disabled:opacity-70 disabled:cursor-not-allowed" 
                  size="lg"
                >
                  <motion.div
                    animate={isGenerating ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                  </motion.div>
                  {isGenerating ? "Generating..." : "Generate Prompt"}
                </Button>
                <Button 
                  onClick={copyPrompt} 
                  variant="outline" 
                  size="lg" 
                  className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-white/20 hover:bg-white dark:hover:bg-white/10 h-12 hover:scale-105 transition-all"
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={clearAll} variant="outline" size="lg" className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-white/20 hover:bg-white dark:hover:bg-white/10 h-12">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Panel - Preview */}
            <PromptPreview prompt={generatedPrompt} />
          </div>

          {/* History Panel - Bottom Section */}
          <motion.div 
            className="max-w-7xl mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <PromptHistory 
              onRestore={restoreFromHistory}
              onHistoryUpdate={() => setHistoryUpdateTrigger(prev => prev + 1)}
              key={historyUpdateTrigger}
            />
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer 
          className="border-t border-white/20 dark:border-white/10 mt-16 py-8 bg-white/50 dark:bg-black/30 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-6">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-sm text-white/70">
                PromptForge • Built with ❤️ for the AI community
              </p>
            </motion.div>
          </div>
        </motion.footer>

        {/* Template Library Dialog */}
        <TemplateLibrary
          isOpen={isTemplateLibraryOpen}
          onClose={() => setIsTemplateLibraryOpen(false)}
          onLoadTemplate={loadTemplate}
          currentFormData={{
            persona,
            useCase,
            tone,
            outputFormat,
            topic,
            constraints,
            language,
            codeSnippet,
            errorMessage
          }}
          currentMode={activeTab as 'general' | 'coding'}
        />

        <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        <Toaster />
      </div>
    </motion.div>
  )
}
