import { Template, TemplateFilter, TemplateSortBy } from './types';

const STORAGE_KEY = 'pf-templates';

/**
 * Template Service
 * Handles loading, filtering, CRUD operations for templates
 */

// Load built-in templates
export async function loadBuiltInTemplates(): Promise<Template[]> {
  try {
    const response = await fetch('/templates/builtin.json');
    if (!response.ok) throw new Error('Failed to load built-in templates');
    const templates = await response.json();
    return templates;
  } catch (error) {
    console.error('Error loading built-in templates:', error);
    return [];
  }
}

// Load user templates from localStorage
export function loadUserTemplates(): Template[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading user templates:', error);
    return [];
  }
}

// Save user templates to localStorage
function saveUserTemplates(templates: Template[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving user templates:', error);
  }
}

// Get all templates (built-in + user)
export async function getAllTemplates(): Promise<Template[]> {
  const builtIn = await loadBuiltInTemplates();
  const user = loadUserTemplates();
  return [...builtIn, ...user];
}

// Filter templates
export function filterTemplates(
  templates: Template[],
  filter: TemplateFilter
): Template[] {
  let filtered = [...templates];

  if (filter.category) {
    filtered = filtered.filter((t) => t.category === filter.category);
  }

  if (filter.model) {
    filtered = filtered.filter((t) => t.model === filter.model);
  }

  if (filter.searchQuery && filter.searchQuery.trim()) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (filter.tags && filter.tags.length > 0) {
    filtered = filtered.filter((t) =>
      filter.tags!.some((tag) => t.tags.includes(tag))
    );
  }

  return filtered;
}

// Sort templates
export function sortTemplates(
  templates: Template[],
  sortBy: TemplateSortBy
): Template[] {
  const sorted = [...templates];

  switch (sortBy) {
    case 'alphabetical':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'recent':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    case 'popular':
      // For now, sort by alphabetical. Can implement usage tracking later
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

// Get template by ID
export async function getTemplateById(id: string): Promise<Template | null> {
  const templates = await getAllTemplates();
  return templates.find((t) => t.id === id) || null;
}

// Create new user template
export function createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'isBuiltIn'>): Template {
  const newTemplate: Template = {
    ...template,
    id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isBuiltIn: false,
  };

  const userTemplates = loadUserTemplates();
  userTemplates.push(newTemplate);
  saveUserTemplates(userTemplates);

  return newTemplate;
}

// Update user template
export function updateTemplate(id: string, updates: Partial<Template>): boolean {
  const userTemplates = loadUserTemplates();
  const index = userTemplates.findIndex((t) => t.id === id);

  if (index === -1 || userTemplates[index].isBuiltIn) {
    return false;
  }

  userTemplates[index] = {
    ...userTemplates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveUserTemplates(userTemplates);
  return true;
}

// Delete user template
export function deleteTemplate(id: string): boolean {
  const userTemplates = loadUserTemplates();
  const filtered = userTemplates.filter((t) => t.id !== id && !t.isBuiltIn);

  if (filtered.length === userTemplates.length) {
    return false; // Template not found or is built-in
  }

  saveUserTemplates(filtered);
  return true;
}

// Duplicate template (creates a new user template from existing)
export function duplicateTemplate(template: Template): Template {
  const duplicate = {
    ...template,
    name: `${template.name} (Copy)`,
  };

  // Remove properties that will be regenerated
  const { id, createdAt, updatedAt, isBuiltIn, ...rest } = duplicate;

  return createTemplate(rest);
}

// Export template as JSON
export function exportTemplate(template: Template): string {
  return JSON.stringify(template, null, 2);
}

// Import template from JSON
export function importTemplate(jsonString: string): Template | null {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Validate required fields
    if (!parsed.name || !parsed.category || !parsed.prompt) {
      throw new Error('Invalid template format');
    }

    // Remove properties that will be regenerated
    const { id, createdAt, updatedAt, isBuiltIn, ...rest } = parsed;

    return createTemplate(rest);
  } catch (error) {
    console.error('Error importing template:', error);
    return null;
  }
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const templates = await getAllTemplates();
  const tags = new Set<string>();
  templates.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

// Get all categories
export function getAllCategories(): string[] {
  return [
    "General",
    "Coding",
    "Study / Exams",
    "Viva / Interview",
    "Writing / Content",
    "Creative",
    "Debug & Error Fixing",
    "Technical",
    "Custom"
  ];
}
