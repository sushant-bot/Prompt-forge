/**
 * Prompt History Panel Component
 * Displays history of generated prompts with search, filter, and restore capabilities
 */

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Trash2, 
  RotateCcw, 
  Search, 
  Filter,
  MessageSquare,
  Code2,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { 
  getAllHistory, 
  deleteHistoryItem, 
  clearAllHistory, 
  searchHistory,
  filterHistoryByMode,
  formatTimestamp,
  getHistoryStats,
  type HistoryItem 
} from "@/lib/history"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PromptHistoryProps {
  onRestore: (item: HistoryItem) => void
  onHistoryUpdate?: () => void
}

export function PromptHistory({ onRestore, onHistoryUpdate }: PromptHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMode, setFilterMode] = useState<'all' | 'general' | 'coding'>('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [stats, setStats] = useState(getHistoryStats())

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    let items = getAllHistory()
    
    // Apply search
    if (searchQuery.trim()) {
      items = searchHistory(searchQuery)
    }
    
    // Apply filter
    if (filterMode !== 'all') {
      items = items.filter(item => item.mode === filterMode)
    }
    
    setHistory(items)
    setStats(getHistoryStats())
  }

  useEffect(() => {
    loadHistory()
  }, [searchQuery, filterMode])

  const handleDelete = (id: string) => {
    setItemToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteHistoryItem(itemToDelete)
      loadHistory()
      onHistoryUpdate?.()
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleClearAll = () => {
    setIsClearAllDialogOpen(true)
  }

  const confirmClearAll = () => {
    clearAllHistory()
    loadHistory()
    onHistoryUpdate?.()
    setIsClearAllDialogOpen(false)
    setExpandedItems(new Set())
  }

  const handleRestore = (item: HistoryItem) => {
    onRestore(item)
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <Card className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Prompt History
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 mt-1">
              {stats.total} prompt{stats.total !== 1 ? 's' : ''} saved • 
              {stats.today > 0 && ` ${stats.today} today`}
            </CardDescription>
          </div>
          {history.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearAll}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-muted/30 border-muted"
            />
          </div>
          <Select value={filterMode} onValueChange={(value: any) => setFilterMode(value)}>
            <SelectTrigger className="w-[130px] h-9 bg-muted/30">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="coding">Coding</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <Clock className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium mb-1">No history yet</p>
            <p className="text-sm text-muted-foreground/70">
              {searchQuery ? 'No results found. Try a different search.' : 'Generate your first prompt to see it here'}
            </p>
          </motion.div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {history.map((item, index) => {
                  const isExpanded = expandedItems.has(item.id)
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      layout
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 group border-muted/40">
                        <CardContent className="p-4">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Badge 
                                variant={item.mode === 'general' ? 'default' : 'secondary'}
                                className="shrink-0"
                              >
                                {item.mode === 'general' ? (
                                  <><MessageSquare className="h-3 w-3 mr-1" /> General</>
                                ) : (
                                  <><Code2 className="h-3 w-3 mr-1" /> Coding</>
                                )}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(item.timestamp)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRestore(item)}
                                className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
                              >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Restore
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                                className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          {/* Metadata */}
                          {(item.metadata.topic || item.metadata.persona || item.metadata.language) && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {item.metadata.topic && (
                                <Badge variant="outline" className="text-xs font-normal">
                                  {truncateText(item.metadata.topic, 40)}
                                </Badge>
                              )}
                              {item.metadata.persona && (
                                <Badge variant="outline" className="text-xs font-normal">
                                  👤 {truncateText(item.metadata.persona, 30)}
                                </Badge>
                              )}
                              {item.metadata.language && (
                                <Badge variant="outline" className="text-xs font-normal">
                                  💻 {item.metadata.language}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Prompt Preview */}
                          <div className="relative">
                            <div 
                              className={`text-sm text-muted-foreground leading-relaxed ${
                                !isExpanded ? 'line-clamp-2' : ''
                              }`}
                            >
                              {item.prompt}
                            </div>
                            {item.prompt.length > 150 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(item.id)}
                                className="h-6 px-2 mt-2 text-xs"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    Show less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    Show more
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}

        {/* Stats Footer */}
        {history.length > 0 && (
          <motion.div 
            className="mt-4 pt-4 border-t border-muted/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {history.length} of {stats.total} total
              </span>
              <div className="flex gap-3">
                <span>{stats.general} General</span>
                <span>{stats.coding} Coding</span>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete History Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this prompt from your history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Clear All History
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {stats.total} prompt{stats.total !== 1 ? 's' : ''} from your history. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
