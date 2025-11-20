import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

interface CodingModeFormProps {
  persona: string
  setPersona: (value: string) => void
  useCase: string
  setUseCase: (value: string) => void
  tone: string
  setTone: (value: string) => void
  outputFormat: string
  setOutputFormat: (value: string) => void
  topic: string
  setTopic: (value: string) => void
  constraints: string
  setConstraints: (value: string) => void
  language: string
  setLanguage: (value: string) => void
  codeSnippet: string
  setCodeSnippet: (value: string) => void
  errorMessage: string
  setErrorMessage: (value: string) => void
}

export function CodingModeForm({
  persona,
  setPersona,
  useCase,
  setUseCase,
  tone,
  setTone,
  outputFormat,
  setOutputFormat,
  topic,
  setTopic,
  constraints,
  setConstraints,
  language,
  setLanguage,
  codeSnippet,
  setCodeSnippet,
  errorMessage,
  setErrorMessage,
}: CodingModeFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-shadow">
        <CardHeader className="pb-4">
        <CardTitle className="text-xl">Coding Configuration</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">Optimize prompts for development tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="persona-coding">Persona Role</Label>
          <Input
            id="persona-coding"
            placeholder="e.g., senior developer, code reviewer, debugging expert"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="useCase-coding">Primary Use Case</Label>
          <Input
            id="useCase-coding"
            placeholder="e.g., debugging, code review, optimization"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Programming Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="php">PHP</SelectItem>
              <SelectItem value="ruby">Ruby</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone-coding">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone-coding">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="outputFormat-coding">Output Format</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger id="outputFormat-coding">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="bullet-points">Bullet Points</SelectItem>
              <SelectItem value="numbered-list">Numbered List</SelectItem>
              <SelectItem value="code">Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic-coding">Task Description</Label>
          <Textarea
            id="topic-coding"
            placeholder="Describe what you need help with..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="codeSnippet">Code Snippet</Label>
          <Textarea
            id="codeSnippet"
            placeholder="Paste your code here..."
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="errorMessage">Error Message (Optional)</Label>
          <Textarea
            id="errorMessage"
            placeholder="Paste any error messages here..."
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            rows={3}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="constraints-coding">Additional Instructions</Label>
          <Textarea
            id="constraints-coding"
            placeholder="Any extra constraints or requirements..."
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
