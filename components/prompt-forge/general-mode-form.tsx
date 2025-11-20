import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

interface GeneralModeFormProps {
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
}

export function GeneralModeForm({
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
}: GeneralModeFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-shadow">
        <CardHeader className="pb-4">
        <CardTitle className="text-xl">General Configuration</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">Build prompts for any task or use case</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="persona">Persona Role</Label>
          <Input
            id="persona"
            placeholder="e.g., expert copywriter, data analyst, teacher"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="useCase">Primary Use Case</Label>
          <Input
            id="useCase"
            placeholder="e.g., content creation, analysis, explanation"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone">
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
          <Label htmlFor="outputFormat">Output Format</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger id="outputFormat">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="bullet-points">Bullet Points</SelectItem>
              <SelectItem value="numbered-list">Numbered List</SelectItem>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic or Task Description</Label>
          <Textarea
            id="topic"
            placeholder="Describe what you need help with..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="constraints">Additional Instructions</Label>
          <Textarea
            id="constraints"
            placeholder="Any extra constraints or requirements..."
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
