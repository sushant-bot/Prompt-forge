/**
 * Template Sync Service
 * Handles template CRUD operations with Supabase
 */

import { createClient } from './client'
import type { PromptTemplate } from '../templates'
import type { Database } from './types'

type SupabaseTemplate = Database['public']['Tables']['templates']['Row']
type SupabaseTemplateInsert = Database['public']['Tables']['templates']['Insert']

/**
 * Convert Supabase template to app template format
 */
function convertFromSupabase(supabaseTemplate: SupabaseTemplate): PromptTemplate {
  return {
    id: supabaseTemplate.id,
    name: supabaseTemplate.name,
    description: supabaseTemplate.description,
    category: supabaseTemplate.category,
    isBuiltIn: false,
    mode: supabaseTemplate.mode,
    data: supabaseTemplate.data,
    createdAt: supabaseTemplate.created_at,
    updatedAt: supabaseTemplate.updated_at,
  }
}

/**
 * Convert app template to Supabase format
 */
function convertToSupabase(template: PromptTemplate, userId: string): SupabaseTemplateInsert {
  return {
    id: template.id,
    user_id: userId,
    name: template.name,
    description: template.description,
    category: template.category,
    mode: template.mode,
    data: template.data,
  }
}

/**
 * Fetch all templates for the current user
 */
export async function fetchUserTemplates(userId: string): Promise<PromptTemplate[]> {
  const supabase = createClient()
  if (!supabase) return []
  
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }

  return data.map(convertFromSupabase)
}

/**
 * Create a new template
 */
export async function createTemplate(template: PromptTemplate, userId: string): Promise<PromptTemplate | null> {
  const supabase = createClient()
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('templates')
    .insert(convertToSupabase(template, userId))
    .select()
    .single()

  if (error) {
    console.error('Error creating template:', error)
    return null
  }

  return convertFromSupabase(data)
}

/**
 * Update an existing template
 */
export async function updateTemplate(
  templateId: string, 
  updates: Partial<PromptTemplate>,
  userId: string
): Promise<PromptTemplate | null> {
  const supabase = createClient()
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('templates')
    .update({
      name: updates.name,
      description: updates.description,
      category: updates.category,
      mode: updates.mode,
      data: updates.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', templateId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating template:', error)
    return null
  }

  return convertFromSupabase(data)
}

/**
 * Delete a template
 */
export async function deleteTemplate(templateId: string, userId: string): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false
  
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', templateId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting template:', error)
    return false
  }

  return true
}

/**
 * Sync local templates to Supabase
 * This is called when a user first logs in to upload their local templates
 */
export async function syncLocalToSupabase(localTemplates: PromptTemplate[], userId: string): Promise<void> {
  const supabase = createClient()
  if (!supabase) return
  
  // Filter out built-in templates
  const userTemplates = localTemplates.filter(t => !t.isBuiltIn)
  
  if (userTemplates.length === 0) return

  const supabaseTemplates = userTemplates.map(t => convertToSupabase(t, userId))

  const { error } = await supabase
    .from('templates')
    .upsert(supabaseTemplates, { onConflict: 'id' })

  if (error) {
    console.error('Error syncing templates:', error)
  }
}
