"use client"

import { useState, useEffect } from "react"
import { X, BookOpen, Mic2, Code2, PenTool, Star, Loader, Save, Trash2 } from "lucide-react"
import { 
  getAllTemplates, 
  saveTemplate, 
  deleteTemplate,
  type PromptTemplate 
} from "@/lib/templates"
import { useAuth } from "@/contexts/auth-context"
import { fetchTemplates, createTemplate, deleteTemplateCloud } from "@/lib/supabase-data"

interface TemplateLibraryProps {
  isOpen: boolean
  onClose: () => void
  onLoadTemplate: (template: any) => void
  currentFormData?: Partial<PromptTemplate['data']>
  currentMode?: 'general' | 'coding'
  currentPrompt?: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  study: <BookOpen className="w-5 h-5" />,
  viva: <Mic2 className="w-5 h-5" />,
  coding: <Code2 className="w-5 h-5" />,
  writing: <PenTool className="w-5 h-5" />,
  custom: <Star className="w-5 h-5" />,
}

const categoryLabels: Record<string, string> = {
  study: "Study",
  viva: "Viva/Interview",
  coding: "Coding",
  writing: "Writing",
  custom: "Custom",
}

export function TemplateLibrary({ isOpen, onClose, onLoadTemplate, currentFormData, currentMode, currentPrompt }: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("study")
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")
  
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [cloudIds, setCloudIds] = useState<Set<string>>(new Set())
  const [loadingCloud, setLoadingCloud] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
    }
  }, [isOpen])

  const loadTemplates = async () => {
    const localAll = getAllTemplates()
    if (!user) {
      setTemplates(localAll)
      setCloudIds(new Set())
      return
    }
    setLoadingCloud(true)
    try {
      const cloud = await fetchTemplates()
      const userCloudTemplates: PromptTemplate[] = cloud
        .filter(ct => !ct.is_built_in)
        .map(ct => ({
          id: ct.id,
          name: ct.name,
          description: ct.description || '',
          category: ct.category as any,
          isBuiltIn: false,
          mode: ct.mode,
          data: ct.data,
          createdAt: ct.created_at || new Date().toISOString(),
          updatedAt: ct.updated_at || new Date().toISOString()
        }))
      
      const merged = [
        ...localAll.filter(t => t.isBuiltIn),
        ...localAll.filter(t => !t.isBuiltIn && !userCloudTemplates.find(c => c.name === t.name)),
        ...userCloudTemplates
      ]
      setTemplates(merged)
      setCloudIds(new Set(userCloudTemplates.map(t => t.id)))
    } catch (e) {
      console.error('Failed to load cloud templates', e)
      setTemplates(localAll)
    } finally {
      setLoadingCloud(false)
    }
  }

  const filteredTemplates = templates.filter(t => t.category === activeCategory)

  const handleLoadTemplate = (template: PromptTemplate) => {
    setLoadingId(template.id)
    setTimeout(() => {
      onLoadTemplate({ ...template, ...template.data })
      setLoadingId(null)
      onClose()
    }, 500)
  }

  const handleDeleteTemplate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Delete this template?')) return
    
    try {
      if (cloudIds.has(id)) {
        await deleteTemplateCloud(id)
      } else {
        deleteTemplate(id)
      }
      loadTemplates()
    } catch (e) {
      alert('Failed to delete template')
    }
  }

  const handleSaveTemplate = async () => {
    if (!newTemplateName.trim() || (!currentFormData && !currentPrompt)) return

    try {
      const templateData = {
        name: newTemplateName,
        description: newTemplateDescription || "Custom saved template",
        category: 'custom' as const,
        isBuiltIn: false,
        mode: currentMode || 'general',
        data: {
          persona: currentFormData?.persona || '',
          useCase: currentFormData?.useCase || '',
          tone: currentFormData?.tone || '',
          outputFormat: currentFormData?.outputFormat || '',
          topic: currentFormData?.topic || '',
          constraints: currentFormData?.constraints || currentPrompt || '',
          language: currentFormData?.language,
          codeSnippet: currentFormData?.codeSnippet,
          errorMessage: currentFormData?.errorMessage
        }
      }

      saveTemplate(templateData)

      if (user) {
        try {
          await createTemplate(templateData)
        } catch (cloudErr) {
          console.warn('Cloud save failed', cloudErr)
        }
      }

      setNewTemplateName("")
      setNewTemplateDescription("")
      setShowSaveDialog(false)
      await loadTemplates()
      setActiveCategory('custom')
    } catch (error) {
      alert('Failed to save template')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl h-[90vh] rounded-2xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-muted/30 p-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Template Library</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose a template to jumpstart your prompt</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Category Tabs */}
          <div className="border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-4 flex gap-2 overflow-x-auto shrink-0 sticky top-0 z-10">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                  activeCategory === key
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {categoryIcons[key]}
                {label}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingCloud && (
                <div className="col-span-full text-sm text-muted-foreground animate-pulse flex items-center gap-2 justify-center py-4">
                  <Loader className="w-4 h-4 animate-spin" />
                  Syncing cloud templates...
                </div>
              )}
              
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 hover:border-primary/50 hover:shadow-lg transition flex flex-col"
                  >
                    {/* Template Card Content */}
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-foreground line-clamp-1">{template.name}</h3>
                        {!template.isBuiltIn && (
                          <button
                            onClick={(e) => handleDeleteTemplate(e, template.id)}
                            className="text-muted-foreground hover:text-destructive transition p-1"
                            aria-label="Delete template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 grow line-clamp-3">{template.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                          {template.mode === 'general' ? 'General' : 'Coding'}
                        </span>
                        {cloudIds.has(template.id) && (
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            Cloud
                          </span>
                        )}
                      </div>

                      {/* Load Button */}
                      <button
                        onClick={() => handleLoadTemplate(template)}
                        disabled={loadingId === template.id}
                        className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm disabled:opacity-50 transition flex items-center justify-center gap-2 mt-auto"
                      >
                        {loadingId === template.id ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load Template"
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Star className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No templates found in this category.</p>
                  {activeCategory === 'custom' && (
                    <p className="text-sm text-muted-foreground/70 mt-2">Save your current form as a template to get started!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 p-4 flex gap-3 justify-end shrink-0">
          {(currentFormData || currentPrompt) && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-foreground font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Current as Template
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-foreground font-medium text-sm transition"
          >
            Close
          </button>
        </div>

        {/* Save Template Dialog */}
        {showSaveDialog && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative rounded-xl border border-border bg-background p-6 shadow-2xl max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold text-foreground mb-4">Save as Template</h3>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                  <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="Enter template name..."
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                  <textarea
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    placeholder="Optional description..."
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-foreground font-medium text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={!newTemplateName.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm disabled:opacity-50 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}