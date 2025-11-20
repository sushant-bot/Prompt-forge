import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PromptPreviewProps {
  prompt: string
}

export function PromptPreview({ prompt }: PromptPreviewProps) {
  const charCount = prompt.length

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="lg:sticky lg:top-24 h-fit bg-white/80 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-shadow">
        <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Preview</CardTitle>
          {charCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-linear-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold">
              {charCount} chars
            </span>
          )}
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-300">
          {charCount > 0 ? "Ready to copy" : "Your prompt will appear here"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-xl border border-white/20 bg-white/50 dark:bg-black/20 backdrop-blur-sm p-6 shadow-inner">
          <AnimatePresence mode="wait">
            {prompt ? (
              <motion.pre 
                key="prompt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-mono whitespace-pre-wrap text-slate-900 dark:text-slate-100 leading-relaxed"
              >
                {prompt}
              </motion.pre>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center h-full text-slate-600 dark:text-slate-300"
              >
                <motion.div 
                  className="h-16 w-16 rounded-2xl bg-linear-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-4 shadow-xl"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-center font-medium text-lg mb-2">
                  Ready to Generate
                </p>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
                  Fill in the form and click Generate Prompt to see your optimized prompt
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
    </motion.div>
  )
}
