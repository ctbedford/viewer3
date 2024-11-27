"use client";

import { Document } from "@/types/document";
import { FileCard } from "./file-card";
import { cn } from "@/lib/utils";

interface FileGridProps {
  documents: Document[];
  selectedDocuments: Set<string>;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDrag: (id: string, e: React.DragEvent) => void;
  onStartConnection: (id: string) => void;
}

export function FileGrid({
  documents,
  selectedDocuments,
  onSelect,
  onDelete,
  onDrag,
  onStartConnection,
}: FileGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {documents.map((doc) => (
        <FileCard
          key={doc.id}
          document={doc}
          isSelected={selectedDocuments.has(doc.id)}
          onSelect={onSelect}
          onDelete={onDelete}
          onDrag={onDrag}
          onStartConnection={onStartConnection}
        />
      ))}
    </div>
  );
}