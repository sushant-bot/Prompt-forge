/**
 * Smart Prompt Generator
 * Implements intelligent prompt construction with context-aware generation
 */

export interface GeneralPromptParams {
  persona: string
  useCase: string
  tone: string
  outputFormat: string
  topic: string
  constraints: string
}

export interface CodingPromptParams extends GeneralPromptParams {
  language: string
  codeSnippet: string
  errorMessage: string
}

/**
 * Tone-specific language patterns
 */
const tonePatterns = {
  professional: {
    prefix: "Please provide",
    suffix: "with attention to detail and accuracy.",
    style: "formal and structured"
  },
  casual: {
    prefix: "Hey, can you help me",
    suffix: "Keep it simple and easy to understand.",
    style: "conversational and relaxed"
  },
  friendly: {
    prefix: "I'd love your help with",
    suffix: "Thanks for your assistance!",
    style: "warm and approachable"
  },
  formal: {
    prefix: "I request assistance with",
    suffix: "Your expertise is greatly appreciated.",
    style: "highly professional and respectful"
  },
  technical: {
    prefix: "Provide technical analysis for",
    suffix: "Include relevant technical details and specifications.",
    style: "precise and technically detailed"
  },
  creative: {
    prefix: "Let's explore",
    suffix: "Feel free to be innovative and think outside the box!",
    style: "imaginative and exploratory"
  }
}

/**
 * Output format specifications
 */
const formatInstructions = {
  paragraph: "Present the information in well-structured paragraphs with clear topic sentences.",
  "bullet-points": "Organize the response using bullet points for easy scanning and comprehension.",
  "numbered-list": "Provide a numbered, sequential list with each step or point clearly defined.",
  table: "Structure the information in a tabular format with appropriate columns and rows.",
  code: "Present the solution as properly formatted, executable code with inline comments.",
  json: "Return the response in valid JSON format with appropriate structure and keys."
}

/**
 * Auto-characterize persona based on use case
 */
export function autoCharacterizePersona(useCase: string): string {
  const useCaseLower = useCase.toLowerCase()
  
  if (useCaseLower.includes("content") || useCaseLower.includes("writing") || useCaseLower.includes("blog")) {
    return "experienced content strategist and copywriter"
  }
  if (useCaseLower.includes("analysis") || useCaseLower.includes("data")) {
    return "senior data analyst with expertise in insights extraction"
  }
  if (useCaseLower.includes("teach") || useCaseLower.includes("explain") || useCaseLower.includes("learn")) {
    return "patient educator with clear communication skills"
  }
  if (useCaseLower.includes("market") || useCaseLower.includes("business")) {
    return "strategic business consultant"
  }
  if (useCaseLower.includes("research")) {
    return "thorough research specialist"
  }
  if (useCaseLower.includes("creative") || useCaseLower.includes("design")) {
    return "creative professional with design thinking expertise"
  }
  
  return "knowledgeable assistant"
}

/**
 * Generate smart prompt for general mode
 */
export function generateGeneralPrompt(params: GeneralPromptParams): string {
  const {
    persona,
    useCase,
    tone,
    outputFormat,
    topic,
    constraints
  } = params

  // Auto-characterize if persona is not provided
  const effectivePersona = persona || (useCase ? autoCharacterizePersona(useCase) : "helpful assistant")
  
  // Get tone pattern
  const tonePattern = tone ? tonePatterns[tone as keyof typeof tonePatterns] : null
  
  // Get format instruction
  const formatInstruction = outputFormat ? formatInstructions[outputFormat as keyof typeof formatInstructions] : null

  // Build the prompt with smart structure
  let prompt = `You are ${effectivePersona}.`
  
  // Add tone-specific opening if available
  if (tonePattern) {
    prompt += `\n\nCommunication Style: ${tonePattern.style}.`
  }

  // Add the main request
  if (topic) {
    prompt += `\n\n${tonePattern ? tonePattern.prefix : "Please help me with"}:\n${topic}`
  } else {
    prompt += `\n\nTask: ${useCase || "Provide assistance as requested"}`
  }

  // Add use case context if provided
  if (useCase && topic) {
    prompt += `\n\nContext: This is for ${useCase.toLowerCase()}.`
  }

  // Add format instructions
  if (formatInstruction) {
    prompt += `\n\nFormat Requirements:\n${formatInstruction}`
  }

  // Add constraints
  if (constraints) {
    prompt += `\n\nAdditional Requirements:\n${constraints}`
  }

  // Add tone-specific closing
  if (tonePattern && tonePattern.suffix) {
    prompt += `\n\n${tonePattern.suffix}`
  }

  return prompt.trim()
}

/**
 * Generate smart prompt for coding mode
 */
export function generateCodingPrompt(params: CodingPromptParams): string {
  const {
    persona,
    useCase,
    tone,
    outputFormat,
    topic,
    constraints,
    language,
    codeSnippet,
    errorMessage
  } = params

  // Auto-characterize for coding context
  const effectivePersona = persona || "senior software engineer with expertise in " + (language || "multiple programming languages")
  
  // Get tone pattern
  const tonePattern = tone ? tonePatterns[tone as keyof typeof tonePatterns] : tonePatterns.technical
  
  // Build the coding prompt
  let prompt = `You are ${effectivePersona}.`
  
  prompt += `\n\nCommunication Style: ${tonePattern.style}.`

  // Add main task
  if (topic) {
    prompt += `\n\n${tonePattern.prefix}:\n${topic}`
  } else {
    prompt += `\n\nTask: ${useCase || "Provide coding assistance"}`
  }

  // Add language context
  if (language) {
    prompt += `\n\nProgramming Language: ${language}`
  }

  // Add code snippet if provided
  if (codeSnippet && codeSnippet.trim()) {
    prompt += `\n\nExisting Code:\n\`\`\`${language || ''}\n${codeSnippet.trim()}\n\`\`\``
  }

  // Add error message if provided
  if (errorMessage && errorMessage.trim()) {
    prompt += `\n\nError Message:\n\`\`\`\n${errorMessage.trim()}\n\`\`\``
    prompt += `\n\nPlease:\n1. Identify the root cause of this error\n2. Explain what's happening\n3. Provide a corrected version of the code\n4. Suggest best practices to avoid similar issues`
  }

  // Add output format for coding
  if (outputFormat === "code") {
    prompt += `\n\nProvide the solution as clean, well-documented code with:\n- Inline comments explaining key logic\n- Proper formatting and indentation\n- Error handling where appropriate`
  } else if (outputFormat === "numbered-list") {
    prompt += `\n\nProvide step-by-step instructions in a numbered list format.`
  } else if (outputFormat === "bullet-points") {
    prompt += `\n\nOrganize your response using bullet points for clarity.`
  }

  // Add constraints
  if (constraints) {
    prompt += `\n\nAdditional Requirements:\n${constraints}`
  }

  // Add technical closing
  prompt += `\n\n${tonePattern.suffix}`

  return prompt.trim()
}

/**
 * Detect if live update should be triggered based on input changes
 */
export function shouldTriggerLiveUpdate(
  prevParams: GeneralPromptParams | CodingPromptParams,
  newParams: GeneralPromptParams | CodingPromptParams
): boolean {
  // Only trigger if meaningful fields have changed
  const meaningfulFields: (keyof GeneralPromptParams)[] = ['persona', 'useCase', 'tone', 'outputFormat', 'topic']
  
  for (const field of meaningfulFields) {
    if (prevParams[field] !== newParams[field]) {
      return true
    }
  }
  
  return false
}
