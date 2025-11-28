// Template Library Types

export type TemplateCategory = 
  | "General"
  | "Coding"
  | "Study / Exams"
  | "Viva / Interview"
  | "Writing / Content"
  | "Creative"
  | "Debug & Error Fixing"
  | "Technical"
  | "Custom";

export type AIModel = "gpt" | "claude" | "gemini" | "copilot" | "v0";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  model: AIModel;
  persona: string;
  tone: string;
  format: string;
  tags: string[];
  variables: string[];
  prompt: string;
  examples: string[];
  createdAt?: string;
  updatedAt?: string;
  isBuiltIn: boolean;
}

export interface TemplateFilter {
  category?: TemplateCategory;
  model?: AIModel;
  searchQuery?: string;
  tags?: string[];
}

export type TemplateSortBy = "recent" | "popular" | "alphabetical";

export interface TemplateVariables {
  topic?: string;
  code?: string;
  error?: string;
  language?: string;
  persona?: string;
  tone?: string;
  format?: string;
  [key: string]: string | undefined;
}
