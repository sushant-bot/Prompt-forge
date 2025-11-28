"use client";

import { useState } from "react";
import { Template, TemplateCategory, AIModel } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getAllCategories } from "@/lib/template-service";
import { extractVariables } from "@/lib/template-processor";

interface TemplateDetailsDialogProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (template: Partial<Template>) => void;
  mode: "view" | "edit" | "create";
}

export function TemplateDetailsDialog({
  template,
  open,
  onOpenChange,
  onSave,
  mode,
}: TemplateDetailsDialogProps) {
  const [formData, setFormData] = useState<Partial<Template>>(
    template || {
      name: "",
      description: "",
      category: "General",
      model: "gpt",
      persona: "",
      tone: "",
      format: "",
      tags: [],
      variables: [],
      prompt: "",
      examples: [],
      isBuiltIn: false,
    }
  );

  const [tagInput, setTagInput] = useState("");
  const [exampleInput, setExampleInput] = useState("");

  const isReadOnly = mode === "view" || (template?.isBuiltIn && mode === "edit");

  const handleSubmit = () => {
    if (onSave && !isReadOnly) {
      // Auto-extract variables from prompt
      const extractedVars = extractVariables(formData.prompt || "");
      onSave({
        ...formData,
        variables: extractedVars,
      });
      onOpenChange(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const addExample = () => {
    if (exampleInput.trim()) {
      setFormData({
        ...formData,
        examples: [...(formData.examples || []), exampleInput.trim()],
      });
      setExampleInput("");
    }
  };

  const removeExample = (index: number) => {
    setFormData({
      ...formData,
      examples: formData.examples?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create New Template"
              : mode === "edit"
              ? "Edit Template"
              : "Template Details"}
          </DialogTitle>
          <DialogDescription>
            {isReadOnly
              ? "View template details and configuration"
              : mode === "create"
              ? "Create a custom prompt template"
              : "Edit your custom template"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter template name"
              disabled={isReadOnly}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of what this template does"
              disabled={isReadOnly}
              rows={2}
            />
          </div>

          {/* Category and Model */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as TemplateCategory })
                }
                disabled={isReadOnly}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAllCategories().map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select
                value={formData.model}
                onValueChange={(value) =>
                  setFormData({ ...formData, model: value as AIModel })
                }
                disabled={isReadOnly}
              >
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt">GPT</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="copilot">Copilot</SelectItem>
                  <SelectItem value="v0">V0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Persona, Tone, Format */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="persona">Persona</Label>
              <Input
                id="persona"
                value={formData.persona}
                onChange={(e) =>
                  setFormData({ ...formData, persona: e.target.value })
                }
                placeholder="e.g., Expert teacher"
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Input
                id="tone"
                value={formData.tone}
                onChange={(e) =>
                  setFormData({ ...formData, tone: e.target.value })
                }
                placeholder="e.g., Professional"
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Input
                id="format"
                value={formData.format}
                onChange={(e) =>
                  setFormData({ ...formData, format: e.target.value })
                }
                placeholder="e.g., Bullet points"
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tags (press Enter)"
                disabled={isReadOnly}
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={isReadOnly}
                variant="secondary"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  {!isReadOnly && (
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt Template</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Enter your prompt template. Use {variable} syntax for variables."
              disabled={isReadOnly}
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use {"{variable}"} syntax for dynamic values (e.g., {"{topic}"}, {"{code}"}, {"{language}"})
            </p>
          </div>

          {/* Variables (auto-detected) */}
          {formData.prompt && (
            <div className="space-y-2">
              <Label>Detected Variables</Label>
              <div className="flex flex-wrap gap-2">
                {extractVariables(formData.prompt || "").map((variable) => (
                  <Badge key={variable} variant="outline">
                    {"{" + variable + "}"}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="space-y-2">
            <Label>Examples (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={exampleInput}
                onChange={(e) => setExampleInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExample())}
                placeholder="Add example (press Enter)"
                disabled={isReadOnly}
              />
              <Button
                type="button"
                onClick={addExample}
                disabled={isReadOnly}
                variant="secondary"
              >
                Add
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {formData.examples?.map((example, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-muted rounded-md"
                >
                  <span className="text-sm flex-1">{example}</span>
                  {!isReadOnly && (
                    <button
                      onClick={() => removeExample(index)}
                      className="hover:text-destructive"
                      aria-label="Remove example"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button onClick={handleSubmit}>
              {mode === "create" ? "Create Template" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
