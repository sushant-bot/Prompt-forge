"use client";

import { Template } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  Eye,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  Play,
} from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onLoad: (template: Template) => void;
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (template: Template) => void;
  onExport: (template: Template) => void;
}

const modelColors: Record<string, string> = {
  gpt: "bg-green-500/10 text-green-500 border-green-500/20",
  claude: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  gemini: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  copilot: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  v0: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

export function TemplateCard({
  template,
  onLoad,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  onExport,
}: TemplateCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg line-clamp-2 leading-tight min-h-[1.5em]">
              {template.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-xs mt-1">
              {template.description}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onPreview(template)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Pencil className="mr-2 h-4 w-4" />
                {template.isBuiltIn ? "View Details" : "Edit"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(template)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onExport(template)}>
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </DropdownMenuItem>
              {!template.isBuiltIn && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(template)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={modelColors[template.model] || ""}
          >
            {template.model.toUpperCase()}
          </Badge>
          {template.isBuiltIn && (
            <Badge variant="secondary" className="text-xs">
              Built-in
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex flex-wrap gap-1.5 min-h-6">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-5 font-normal"
            >
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onLoad(template)}
            className="flex-1 h-8 text-xs"
            size="sm"
          >
            <Play className="mr-2 h-3 w-3" />
            Load
          </Button>
          <Button
            onClick={() => onPreview(template)}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
