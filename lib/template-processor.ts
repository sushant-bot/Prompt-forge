import { Template, TemplateVariables } from './types';

/**
 * Template Processor
 * Handles variable substitution and prompt assembly
 */

/**
 * Process a template by substituting variables
 * @param template The template to process
 * @param variables The variables to substitute
 * @returns The processed prompt with variables substituted
 */
export function processTemplate(
  template: Template,
  variables: TemplateVariables
): string {
  let processedPrompt = template.prompt;

  // Substitute all variables
  template.variables.forEach((varName) => {
    const value = variables[varName] || `[${varName.toUpperCase()}]`;
    const regex = new RegExp(`\\{${varName}\\}`, 'g');
    processedPrompt = processedPrompt.replace(regex, value);
  });

  // Append examples if they exist
  if (template.examples && template.examples.length > 0) {
    processedPrompt += '\n\n**Examples:**\n';
    template.examples.forEach((example, index) => {
      processedPrompt += `\n${index + 1}. ${example}`;
    });
  }

  return processedPrompt;
}

/**
 * Extract variables from a prompt template
 * @param prompt The prompt text containing {variable} placeholders
 * @returns Array of variable names found in the prompt
 */
export function extractVariables(prompt: string): string[] {
  const regex = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = regex.exec(prompt)) !== null) {
    variables.add(match[1]);
  }

  return Array.from(variables);
}

/**
 * Validate that all required variables are provided
 * @param template The template to validate against
 * @param variables The variables provided
 * @returns Object with validation result and missing variables
 */
export function validateVariables(
  template: Template,
  variables: TemplateVariables
): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];

  template.variables.forEach((varName) => {
    if (!variables[varName] || variables[varName].trim() === '') {
      missing.push(varName);
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Generate a formatted prompt output for display
 * @param template The template being used
 * @param processedPrompt The processed prompt with substituted variables
 * @returns Formatted string for display
 */
export function formatPromptOutput(
  template: Template,
  processedPrompt: string
): string {
  return `**Template Name:** ${template.name}

**Final Prompt:**
--------------------
${processedPrompt}
--------------------`;
}

/**
 * Adapt prompt formatting for different AI models
 * @param prompt The prompt to adapt
 * @param model The target AI model
 * @returns Adapted prompt optimized for the model
 */
export function adaptForModel(prompt: string, model: string): string {
  switch (model.toLowerCase()) {
    case 'claude':
      // Claude prefers XML-style tags for structure
      return prompt;
    
    case 'gemini':
      // Gemini works well with clear sections
      return prompt;
    
    case 'copilot':
      // GitHub Copilot prefers concise, code-focused prompts
      return prompt;
    
    case 'v0':
      // V0 by Vercel optimized for UI generation
      return prompt;
    
    case 'gpt':
    default:
      // GPT works well with structured prompts
      return prompt;
  }
}

/**
 * Create a preview of how the template will look with current variables
 * @param template The template
 * @param variables Current variable values
 * @param maxLength Maximum length for preview (default 500)
 * @returns Preview string
 */
export function createPreview(
  template: Template,
  variables: TemplateVariables,
  maxLength: number = 500
): string {
  const processed = processTemplate(template, variables);
  
  if (processed.length <= maxLength) {
    return processed;
  }

  return processed.substring(0, maxLength) + '...';
}
