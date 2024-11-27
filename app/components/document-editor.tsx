"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Document } from "@/types/document";

interface DocumentEditorProps {
  document: Document;
  onSave: (id: string, content: string) => void;
  onClose: () => void;
}

export function DocumentEditor({
  document,
  onSave,
  onClose,
}: DocumentEditorProps) {
  const [content, setContent] = useState(document.content || "");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleSave = useCallback(() => {
    onSave(document.id, content);
    setIsDirty(false);
  }, [document.id, content, onSave]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          <span className="font-medium">{document.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Textarea
        value={content}
        onChange={handleChange}
        className="flex-1 resize-none p-4 focus-visible:ring-0 border-0"
        placeholder="Start typing..."
      />
    </div>
  );
}