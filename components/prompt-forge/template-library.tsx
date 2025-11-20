"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookTemplate, Trash2, Edit, Save, X, Plus } from "lucide-react"
import { 
  getAllTemplates, 
  getTemplatesByCategory, 
  saveTemplate, 
  updateTemplate, 
  deleteTemplate,
  TEMPLATE_CATEGORIES,
  type PromptTemplate 
} from "@/lib/templates"

interface TemplateLibraryProps {
  isOpen: boolean
  onClose: () => void
  onLoadTemplate: (template: PromptTemplate) => void
  currentFormData?: Partial<PromptTemplate['data']>
  currentMode?: 'general' | 'coding'
}

export function TemplateLibrary({ isOpen, onClose, onLoadTemplate, currentFormData, currentMode }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('study')
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateDescription, setNewTemplateDescription] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
    }
  }, [isOpen])

  const loadTemplates = () => {
    setTemplates(getAllTemplates())
  }

  const handleLoadTemplate = (template: PromptTemplate) => {
    onLoadTemplate(template)
    onClose()
  }

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(id)
      loadTemplates()
    }
  }

  const handleSaveCurrentAsTemplate = () => {
    if (!currentFormData || !newTemplateName) return

    try {
      saveTemplate({
        name: newTemplateName,
        description: newTemplateDescription,
        category: 'custom',
        isBuiltIn: false,
        mode: currentMode || 'general',
        data: currentFormData as PromptTemplate['data']
      })

      setNewTemplateName('')
      setNewTemplateDescription('')
      setIsSaveDialogOpen(false)
      loadTemplates()
      setActiveCategory('custom')
    } catch (error) {
      alert('Failed to save template. Please try again.')
    }
  }

  const filteredTemplates = getTemplatesByCategory(activeCategory as any)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[85vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl flex items-center gap-3">
              <BookTemplate className="h-7 w-7 text-primary" />
              Template Library
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Choose from built-in templates or your saved templates to quickly start creating prompts
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-5 h-auto p-1.5 bg-muted/50">
                {TEMPLATE_CATEGORIES.map(cat => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id} 
                    className="gap-2 px-4 py-3 text-sm font-medium data-[state=active]:shadow-md transition-all"
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="hidden sm:inline">{cat.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <ScrollArea className="h-[420px] mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-5 pr-4"
                  >
                    {filteredTemplates.length === 0 ? (
                      <Card className="bg-muted/30 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                          <BookTemplate className="h-16 w-16 text-muted-foreground/60 mb-4" />
                          <p className="text-muted-foreground text-center text-base">
                            No templates in this category yet.
                            {activeCategory === 'custom' && (
                              <span className="block mt-3 text-sm">Save your current form as a template to get started!</span>
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredTemplates.map(template => (
                        <Card 
                          key={template.id}
                          className="hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                  {template.name}
                                </CardTitle>
                                <CardDescription className="mt-2 text-sm leading-relaxed">
                                  {template.description}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLoadTemplate(template)}
                                  className="bg-primary/10 hover:bg-primary/20 text-primary font-medium px-4 py-2 h-9"
                                >
                                  Load
                                </Button>
                                {!template.isBuiltIn && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 px-3 py-2 h-9"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                                {template.mode === 'general' ? '📝 General' : '💻 Coding'}
                              </span>
                              <span className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                                {template.data.tone || 'No tone'}
                              </span>
                              <span className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                                {template.data.outputFormat || 'No format'}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </Tabs>
          </div>

          <DialogFooter className="px-6 py-5 border-t bg-muted/20">
            <Button variant="outline" onClick={onClose} className="px-6">
              Close
            </Button>
            {currentFormData && (
              <Button onClick={() => setIsSaveDialogOpen(true)} className="gap-2 px-6">
                <Save className="h-4 w-4" />
                Save Current as Template
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Save className="h-5 w-5 text-primary" />
              Save Current Form as Template
            </DialogTitle>
            <DialogDescription className="text-sm mt-2">
              Give your template a name and description to save it for later use
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name" className="text-sm font-medium">
                Template Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="template-name"
                placeholder="e.g., My Custom Analysis Template"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="template-description"
                placeholder="Describe what this template is for..."
                value={newTemplateDescription}
                onChange={(e) => setNewTemplateDescription(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsSaveDialogOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveCurrentAsTemplate}
              disabled={!newTemplateName}
              className="px-6"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
