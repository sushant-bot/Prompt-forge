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
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <BookTemplate className="h-6 w-6" />
              Template Library
            </DialogTitle>
            <DialogDescription>
              Choose from built-in templates or your saved templates to quickly start creating prompts
            </DialogDescription>
          </DialogHeader>

          <div className="px-6">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-5">
                {TEMPLATE_CATEGORIES.map(cat => (
                  <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                    <span>{cat.icon}</span>
                    <span className="hidden sm:inline">{cat.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <ScrollArea className="h-[400px] mt-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4 pr-4"
                  >
                    {filteredTemplates.length === 0 ? (
                      <Card className="bg-muted">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <BookTemplate className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground text-center">
                            No templates in this category yet.
                            {activeCategory === 'custom' && (
                              <span className="block mt-2">Save your current form as a template to get started!</span>
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredTemplates.map(template => (
                        <Card 
                          key={template.id}
                          className="hover:shadow-lg transition-shadow cursor-pointer"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                <CardDescription className="mt-1">{template.description}</CardDescription>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLoadTemplate(template)}
                                  className="bg-primary/10 hover:bg-primary/20"
                                >
                                  Load
                                </Button>
                                {!template.isBuiltIn && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {template.mode === 'general' ? '📝 General' : '💻 Coding'}
                              </span>
                              <span className="px-2 py-1 rounded-full bg-secondary">
                                {template.data.tone || 'No tone'}
                              </span>
                              <span className="px-2 py-1 rounded-full bg-secondary">
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

          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {currentFormData && (
              <Button onClick={() => setIsSaveDialogOpen(true)} className="gap-2">
                <Save className="h-4 w-4" />
                Save Current as Template
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Current Form as Template</DialogTitle>
            <DialogDescription>
              Give your template a name and description to save it for later use
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                placeholder="e.g., My Custom Analysis Template"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                placeholder="Describe what this template is for..."
                value={newTemplateDescription}
                onChange={(e) => setNewTemplateDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveCurrentAsTemplate}
              disabled={!newTemplateName}
            >
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
