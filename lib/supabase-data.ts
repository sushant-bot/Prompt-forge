import { supabase } from './supabase-client'
import type { PromptTemplate } from '@/lib/templates'
import type { HistoryItem } from '@/lib/history'

// Cloud template shape in DB
export interface CloudTemplateRow {
  id: string
  user_id: string | null
  name: string
  description: string | null
  category: string
  is_built_in: boolean
  mode: 'general' | 'coding'
  data: any
  created_at: string
  updated_at: string
}

export interface CloudHistoryRow {
  id: string
  user_id: string
  mode: 'general' | 'coding'
  prompt: string
  metadata: any
  created_at: string
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// Templates CRUD
export async function fetchTemplates(): Promise<CloudTemplateRow[]> {
  const session = await getSession()
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  // Filter built-in templates (user_id null or is_built_in)
  return (data as CloudTemplateRow[]).filter(row => row.is_built_in || (session?.user && row.user_id === session.user.id))
}

export async function createTemplate(template: {
  name: string
  description?: string
  category: string
  mode: 'general' | 'coding'
  data: any
  isBuiltIn?: boolean
}) {
  const session = await getSession()
  if (!session?.user) throw new Error('Not authenticated')
  const { error } = await supabase.from('templates').insert({
    user_id: session.user.id,
    name: template.name,
    description: template.description,
    category: template.category,
    is_built_in: template.isBuiltIn ?? false,
    mode: template.mode,
    data: template.data,
  })
  if (error) throw error
}

export async function deleteTemplateCloud(id: string) {
  const { error } = await supabase.from('templates').delete().eq('id', id)
  if (error) throw error
}

// History
export async function addHistoryCloud(item: { mode: 'general' | 'coding'; prompt: string; metadata: any }) {
  const session = await getSession()
  if (!session?.user) throw new Error('Not authenticated')
  const { error } = await supabase.from('history').insert({
    user_id: session.user.id,
    mode: item.mode,
    prompt: item.prompt,
    metadata: item.metadata,
  })
  if (error) throw error
}

export async function fetchHistoryCloud(): Promise<CloudHistoryRow[]> {
  const session = await getSession()
  if (!session?.user) return []
  const { data, error } = await supabase
    .from('history')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as CloudHistoryRow[]).filter(row => row.user_id === session.user!.id)
}

export async function deleteHistoryCloud(id: string) {
  const { error } = await supabase.from('history').delete().eq('id', id)
  if (error) throw error
}

// Sync local templates (array of PromptTemplate) to cloud if not existing by name
export async function syncLocalTemplates(local: PromptTemplate[]) {
  const session = await getSession()
  if (!session?.user) return
  const cloud = await fetchTemplates()
  const existingNames = new Set(cloud.map(t => t.name))
  const toUpload = local.filter(t => !t.isBuiltIn && !existingNames.has(t.name))
  for (const t of toUpload) {
    await createTemplate({
      name: t.name,
      description: t.description,
      category: t.category,
      mode: t.mode,
      data: t.data,
      isBuiltIn: false,
    })
  }
}

export async function syncLocalHistory(local: HistoryItem[]) {
  const session = await getSession()
  if (!session?.user) return
  const cloud = await fetchHistoryCloud()
  // Basic duplicate prevention: compare prompt text + mode
  const sigs = new Set(cloud.map(h => h.mode + '|' + h.prompt.substring(0, 200)))
  for (const h of local) {
    const sig = h.mode + '|' + h.prompt.substring(0, 200)
    if (!sigs.has(sig)) {
      await addHistoryCloud({ mode: h.mode, prompt: h.prompt, metadata: h.metadata })
    }
  }
}
