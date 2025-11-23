/**
 * Prompt History Service
 * Tracks and syncs prompt generation history
 */

import { createClient } from './client'
import type { Database } from './types'

type PromptHistory = Database['public']['Tables']['prompt_history']['Row']
type PromptHistoryInsert = Database['public']['Tables']['prompt_history']['Insert']

export interface HistoryItem {
  id: string
  mode: 'general' | 'coding'
  prompt: string
  data: {
    persona: string
    useCase: string
    tone: string
    outputFormat: string
    topic: string
    constraints: string
    language?: string
    codeSnippet?: string
    errorMessage?: string
  }
  createdAt: string
}

/**
 * Convert Supabase history to app history format
 */
function convertFromSupabase(supabaseHistory: PromptHistory): HistoryItem {
  return {
    id: supabaseHistory.id,
    mode: supabaseHistory.mode,
    prompt: supabaseHistory.prompt,
    data: supabaseHistory.data,
    createdAt: supabaseHistory.created_at,
  }
}

/**
 * Fetch history for the current user
 */
export async function fetchHistory(userId: string, limit = 50): Promise<HistoryItem[]> {
  const supabase = createClient()
  if (!supabase) return []
  
  const { data, error } = await supabase
    .from('prompt_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching history:', error)
    return []
  }

  return data.map(convertFromSupabase)
}

/**
 * Add a new history entry
 */
export async function addHistoryEntry(
  userId: string,
  mode: 'general' | 'coding',
  prompt: string,
  data: HistoryItem['data']
): Promise<HistoryItem | null> {
  const supabase = createClient()
  if (!supabase) return null
  
  const entry: PromptHistoryInsert = {
    user_id: userId,
    mode,
    prompt,
    data,
  }

  const { data: newEntry, error } = await supabase
    .from('prompt_history')
    .insert(entry)
    .select()
    .single()

  if (error) {
    console.error('Error adding history entry:', error)
    return null
  }

  return convertFromSupabase(newEntry)
}

/**
 * Delete a history entry
 */
export async function deleteHistoryEntry(historyId: string, userId: string): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false
  
  const { error } = await supabase
    .from('prompt_history')
    .delete()
    .eq('id', historyId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting history entry:', error)
    return false
  }

  return true
}

/**
 * Clear all history for a user
 */
export async function clearHistory(userId: string): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false
  
  const { error } = await supabase
    .from('prompt_history')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('Error clearing history:', error)
    return false
  }

  return true
}

/**
 * LocalStorage key for history
 */
const HISTORY_STORAGE_KEY = 'promptforge_history'

/**
 * Get local history (fallback when not logged in)
 */
export function getLocalHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as HistoryItem[]
  } catch (error) {
    console.error('Error loading local history:', error)
    return []
  }
}

/**
 * Save to local history
 */
export function saveToLocalHistory(item: HistoryItem): void {
  if (typeof window === 'undefined') return
  
  try {
    const history = getLocalHistory()
    history.unshift(item) // Add to beginning
    
    // Keep only last 50 items
    const trimmed = history.slice(0, 50)
    
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error('Error saving local history:', error)
  }
}

/**
 * Sync local history to Supabase
 */
export async function syncLocalHistoryToSupabase(userId: string): Promise<void> {
  const localHistory = getLocalHistory()
  
  if (localHistory.length === 0) return

  const supabase = createClient()
  if (!supabase) return
  
  const entries: PromptHistoryInsert[] = localHistory.map(item => ({
    id: item.id,
    user_id: userId,
    mode: item.mode,
    prompt: item.prompt,
    data: item.data,
    created_at: item.createdAt,
  }))

  const { error } = await supabase
    .from('prompt_history')
    .upsert(entries, { onConflict: 'id' })

  if (error) {
    console.error('Error syncing history:', error)
  }
}
