/**
 * Prompt History Management System
 * Handles saving, retrieving, and managing prompt generation history
 */

export interface HistoryItem {
  id: string
  timestamp: number
  mode: 'general' | 'coding'
  prompt: string
  metadata: {
    persona?: string
    useCase?: string
    tone?: string
    outputFormat?: string
    topic?: string
    language?: string
  }
}

const HISTORY_STORAGE_KEY = 'promptforge_history'
const MAX_HISTORY_ITEMS = 50

/**
 * Get all history items from localStorage
 */
export function getAllHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!stored) return []
    
    const history: HistoryItem[] = JSON.parse(stored)
    // Sort by timestamp descending (newest first)
    return history.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('Failed to load history:', error)
    return []
  }
}

/**
 * Save a new history item
 */
export function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const newItem: HistoryItem = {
    ...item,
    id: generateId(),
    timestamp: Date.now()
  }
  
  try {
    const history = getAllHistory()
    
    // Add new item at the beginning
    history.unshift(newItem)
    
    // Keep only the most recent MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS)
    
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory))
    
    return newItem
  } catch (error) {
    console.error('Failed to save to history:', error)
    throw error
  }
}

/**
 * Delete a specific history item
 */
export function deleteHistoryItem(id: string): void {
  try {
    const history = getAllHistory()
    const filtered = history.filter(item => item.id !== id)
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete history item:', error)
    throw error
  }
}

/**
 * Clear all history
 */
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear history:', error)
    throw error
  }
}

/**
 * Get a specific history item by ID
 */
export function getHistoryItem(id: string): HistoryItem | null {
  const history = getAllHistory()
  return history.find(item => item.id === id) || null
}

/**
 * Search history by query
 */
export function searchHistory(query: string): HistoryItem[] {
  if (!query.trim()) return getAllHistory()
  
  const history = getAllHistory()
  const lowerQuery = query.toLowerCase()
  
  return history.filter(item => {
    return (
      item.prompt.toLowerCase().includes(lowerQuery) ||
      item.metadata.topic?.toLowerCase().includes(lowerQuery) ||
      item.metadata.persona?.toLowerCase().includes(lowerQuery) ||
      item.metadata.useCase?.toLowerCase().includes(lowerQuery)
    )
  })
}

/**
 * Filter history by mode
 */
export function filterHistoryByMode(mode: 'general' | 'coding' | 'all'): HistoryItem[] {
  if (mode === 'all') return getAllHistory()
  
  const history = getAllHistory()
  return history.filter(item => item.mode === mode)
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

/**
 * Get history statistics
 */
export function getHistoryStats(): {
  total: number
  general: number
  coding: number
  today: number
  thisWeek: number
} {
  const history = getAllHistory()
  const now = Date.now()
  const oneDayAgo = now - 86400000
  const oneWeekAgo = now - 604800000
  
  return {
    total: history.length,
    general: history.filter(h => h.mode === 'general').length,
    coding: history.filter(h => h.mode === 'coding').length,
    today: history.filter(h => h.timestamp > oneDayAgo).length,
    thisWeek: history.filter(h => h.timestamp > oneWeekAgo).length
  }
}
