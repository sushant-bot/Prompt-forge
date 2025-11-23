/**
 * Supabase Database Types
 * Define the schema for templates and history
 */

export interface Database {
  public: {
    Tables: {
      templates: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          category: 'study' | 'viva' | 'coding' | 'writing' | 'custom'
          mode: 'general' | 'coding'
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          category: 'study' | 'viva' | 'coding' | 'writing' | 'custom'
          mode: 'general' | 'coding'
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
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          category?: 'study' | 'viva' | 'coding' | 'writing' | 'custom'
          mode?: 'general' | 'coding'
          data?: {
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
          created_at?: string
          updated_at?: string
        }
      }
      prompt_history: {
        Row: {
          id: string
          user_id: string
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
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
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
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mode?: 'general' | 'coding'
          prompt?: string
          data?: {
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
          created_at?: string
        }
      }
    }
  }
}
