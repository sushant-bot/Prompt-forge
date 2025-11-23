/**
 * Supabase Client Configuration
 * Browser-side client for client components
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Return a dummy client if credentials are not provided
  // This allows the app to work without Supabase configuration
  if (!url || !key) {
    // Return a mock client that does nothing
    return null as any
  }
  
  return createBrowserClient(url, key)
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
