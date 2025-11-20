/**
 * Template Library System
 * Manages built-in and user-saved prompt templates
 */

export interface PromptTemplate {
  id: string
  name: string
  description: string
  category: 'study' | 'viva' | 'coding' | 'writing' | 'custom'
  isBuiltIn: boolean
  mode: 'general' | 'coding'
  data: {
    persona: string
    useCase: string
    tone: string
    outputFormat: string
    topic: string
    constraints: string
    // Coding-specific fields
    language?: string
    codeSnippet?: string
    errorMessage?: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Built-in templates
 */
export const BUILT_IN_TEMPLATES: PromptTemplate[] = [
  // Study Templates
  {
    id: 'study-research-paper',
    name: 'Research Paper Analysis',
    description: 'Analyze academic papers and extract key insights',
    category: 'study',
    isBuiltIn: true,
    mode: 'general',
    data: {
      persona: 'academic research specialist',
      useCase: 'research analysis',
      tone: 'formal',
      outputFormat: 'numbered-list',
      topic: '',
      constraints: 'Focus on methodology, findings, and implications. Include citations where relevant.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'study-essay-writing',
    name: 'Essay Writing Assistant',
    description: 'Help structure and write academic essays',
    category: 'study',
    isBuiltIn: true,
    mode: 'general',
    data: {
      persona: 'experienced academic writing tutor',
      useCase: 'essay writing',
      tone: 'professional',
      outputFormat: 'paragraph',
      topic: '',
      constraints: 'Include introduction, body paragraphs with evidence, and conclusion. Follow academic writing standards.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'study-exam-prep',
    name: 'Exam Preparation',
    description: 'Create comprehensive study guides and practice questions',
    category: 'study',
    isBuiltIn: true,
    mode: 'general',
    data: {
      persona: 'experienced exam preparation coach',
      useCase: 'exam preparation',
      tone: 'professional',
      outputFormat: 'bullet-points',
      topic: '',
      constraints: 'Include key concepts, practice questions, and memory techniques. Break down complex topics into manageable sections.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Viva/Interview Templates
  {
    id: 'viva-defense',
    name: 'Thesis Defense Preparation',
    description: 'Prepare for thesis or dissertation defense questions',
    category: 'viva',
    isBuiltIn: true,
    mode: 'general',
    data: {
      persona: 'experienced thesis advisor',
      useCase: 'thesis defense',
      tone: 'formal',
      outputFormat: 'numbered-list',
      topic: '',
      constraints: 'Generate potential questions, strong answers, and ways to defend methodology. Include follow-up questions examiners might ask.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'viva-technical-interview',
    name: 'Technical Interview Prep',
    description: 'Practice for technical job interviews',
    category: 'viva',
    isBuiltIn: true,
    mode: 'general',
    data: {
      persona: 'senior technical interviewer',
      useCase: 'interview preparation',
      tone: 'professional',
      outputFormat: 'bullet-points',
      topic: '',
      constraints: 'Include common questions, optimal answers, and follow-up scenarios. Cover both technical and behavioral aspects.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Coding Templates
  {
    id: 'coding-bug-fix',
    name: 'Bug Fixing Assistant',
    description: 'Debug code and identify root causes',
    category: 'coding',
    isBuiltIn: true,
    mode: 'coding',
    data: {
      persona: 'senior debugging specialist',
      useCase: 'debugging',
      tone: 'technical',
      outputFormat: 'numbered-list',
      topic: 'Identify and fix the bug in the provided code',
      constraints: 'Explain the root cause, provide corrected code, and suggest prevention strategies.',
      language: '',
      codeSnippet: '',
      errorMessage: ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'coding-code-review',
    name: 'Code Review',
    description: 'Get comprehensive code review and suggestions',
    category: 'coding',
    isBuiltIn: true,
    mode: 'coding',
    data: {
      persona: 'experienced code reviewer',
      useCase: 'code review',
      tone: 'professional',
      outputFormat: 'bullet-points',
      topic: 'Review the code for quality, performance, and best practices',
      constraints: 'Check for bugs, security issues, performance problems, and style violations. Suggest improvements.',
      language: '',
      codeSnippet: '',
      errorMessage: ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'coding-refactoring',
    name: 'Code Refactoring',
    description: 'Improve code structure and maintainability',
    category: 'coding',
    isBuiltIn: true,
    mode: 'coding',
    data: {
      persona: 'software architecture expert',
      useCase: 'code refactoring',
      tone: 'technical',
      outputFormat: 'code',
      topic: 'Refactor the code to improve readability and maintainability',
      constraints: 'Apply SOLID principles, DRY, and design patterns where appropriate. Maintain functionality.',
      language: '',
      codeSnippet: '',
      errorMessage: ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Writing Templates
  {
    id: 'writing-blog-post',
    name: 'Blog Post Creator',
    description: 'Write engaging blog posts',
    category: 'writing',
    isBuiltIn: true,
    mode: 'general',
    data: {
      persona: 'professional content writer',
      useCase: 'blog writing',
      tone: 'friendly',
      outputFormat: 'paragraph',
      topic: '',
      constraints: 'Create an engaging introduction, informative body, and compelling conclusion. Use storytelling and examples.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'writing-technical-docs',
    name: 'Technical Documentation',
    description: 'Create clear technical documentation',
    category: 'writing',
    isBuiltIn: true,
    mode: 'general',
    data: {
      persona: 'technical documentation specialist',
      useCase: 'documentation',
      tone: 'technical',
      outputFormat: 'numbered-list',
      topic: '',
      constraints: 'Be clear, concise, and precise. Include examples, code snippets if relevant, and follow documentation best practices.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'writing-creative-story',
    name: 'Creative Story Writing',
    description: 'Write creative fiction and narratives',
    category: 'writing',
    isBuiltIn: true,
    mode: 'general',
    data: {
      persona: 'creative writing coach',
      useCase: 'creative writing',
      tone: 'creative',
      outputFormat: 'paragraph',
      topic: '',
      constraints: 'Focus on character development, plot structure, and engaging narrative. Use vivid descriptions and dialogue.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

/**
 * LocalStorage key for user templates
 */
const STORAGE_KEY = 'promptforge_user_templates'

/**
 * Get all templates (built-in + user-saved)
 */
export function getAllTemplates(): PromptTemplate[] {
  const userTemplates = getUserTemplates()
  return [...BUILT_IN_TEMPLATES, ...userTemplates]
}

/**
 * Get user-saved templates from localStorage
 */
export function getUserTemplates(): PromptTemplate[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as PromptTemplate[]
  } catch (error) {
    console.error('Error loading user templates:', error)
    return []
  }
}

/**
 * Save a new template
 */
export function saveTemplate(template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): PromptTemplate {
  const newTemplate: PromptTemplate = {
    ...template,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const userTemplates = getUserTemplates()
  userTemplates.push(newTemplate)
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userTemplates))
  } catch (error) {
    console.error('Error saving template:', error)
    throw new Error('Failed to save template')
  }

  return newTemplate
}

/**
 * Update an existing template
 */
export function updateTemplate(id: string, updates: Partial<PromptTemplate>): PromptTemplate | null {
  const userTemplates = getUserTemplates()
  const index = userTemplates.findIndex(t => t.id === id)
  
  if (index === -1) return null

  const updatedTemplate: PromptTemplate = {
    ...userTemplates[index],
    ...updates,
    id: userTemplates[index].id, // Ensure ID doesn't change
    isBuiltIn: userTemplates[index].isBuiltIn, // Ensure built-in status doesn't change
    createdAt: userTemplates[index].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString()
  }

  userTemplates[index] = updatedTemplate

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userTemplates))
  } catch (error) {
    console.error('Error updating template:', error)
    throw new Error('Failed to update template')
  }

  return updatedTemplate
}

/**
 * Delete a template
 */
export function deleteTemplate(id: string): boolean {
  const userTemplates = getUserTemplates()
  const filtered = userTemplates.filter(t => t.id !== id)
  
  if (filtered.length === userTemplates.length) {
    return false // Template not found
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting template:', error)
    throw new Error('Failed to delete template')
  }
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: PromptTemplate['category']): PromptTemplate[] {
  return getAllTemplates().filter(t => t.category === category)
}

/**
 * Get a single template by ID
 */
export function getTemplateById(id: string): PromptTemplate | undefined {
  return getAllTemplates().find(t => t.id === id)
}

/**
 * Category metadata
 */
export const TEMPLATE_CATEGORIES = [
  { id: 'study', name: 'Study', icon: '📚', description: 'Research, essays, and exam preparation' },
  { id: 'viva', name: 'Viva/Interview', icon: '🎤', description: 'Defense and interview preparation' },
  { id: 'coding', name: 'Coding', icon: '💻', description: 'Debugging, review, and refactoring' },
  { id: 'writing', name: 'Writing', icon: '✍️', description: 'Blog posts, docs, and creative writing' },
  { id: 'custom', name: 'Custom', icon: '⭐', description: 'Your saved templates' }
] as const
