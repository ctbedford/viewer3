"use client";

import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  onSearch: (query: string) => void;
  onCreateNew: () => void;
}

export function Toolbar({ onSearch, onCreateNew }: ToolbarProps) {
  return (
    <div className="flex items-center gap-4 mb-4 p-4 bg-card rounded-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search documents..."
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button onClick={onCreateNew} className="gap-2">
        <Plus className="w-4 h-4" />
        New Document
      </Button>
    </div>
  );
}