"use client";

import { useState } from "react";
import { File, Trash2, Link, Eye, FileText, Image, FileArchive } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Document } from "@/types/document";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface FileCardProps {
  document: Document;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDrag: (id: string, e: React.DragEvent) => void;
  onStartConnection: (id: string) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("text/")) return FileText;
  if (type.includes("zip") || type.includes("archive")) return FileArchive;
  return File;
};

const formatFileSize = (size: number) => {
  if (!size) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

export function FileCard({
  document,
  isSelected,
  onSelect,
  onDelete,
  onDrag,
  onStartConnection,
}: FileCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const FileIcon = getFileIcon(document.type);

  return (
    <>
      <div
        className={cn(
          "group relative p-4 bg-card rounded-lg shadow-sm cursor-pointer",
          "border border-border transition-all duration-200",
          "hover:shadow-md hover:scale-[1.02]",
          isSelected && "ring-2 ring-primary ring-opacity-50"
        )}
        onClick={() => onSelect(document.id)}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          onDrag(document.id, e);
        }}
      >
        <div className="flex items-start gap-3">
          <FileIcon className="w-8 h-8 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-card-foreground truncate">
              {document.name}
            </h3>
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {document.type}
              </Badge>
              {document.size && (
                <Badge variant="outline" className="text-xs">
                  {formatFileSize(document.size)}
                </Badge>
              )}
            </div>
            {document.createdAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Created {formatDistanceToNow(new Date(document.createdAt))} ago
              </p>
            )}
          </div>
        </div>

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPreview(true);
            }}
            className="p-1 rounded-full hover:bg-secondary"
            aria-label="Preview file"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartConnection(document.id);
            }}
            className="p-1 rounded-full hover:bg-secondary"
            aria-label="Create connection"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(document.id);
            }}
            className="p-1 rounded-full hover:bg-destructive/10 text-destructive"
            aria-label="Delete file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileIcon className="w-5 h-5" />
              {document.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {document.type.startsWith("image/") ? (
              <img
                src={document.content}
                alt={document.name}
                className="max-h-[60vh] object-contain mx-auto rounded-lg"
              />
            ) : (
              <pre className="p-4 bg-muted rounded-lg overflow-auto max-h-[60vh] whitespace-pre-wrap">
                {document.content || "No preview available"}
              </pre>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}