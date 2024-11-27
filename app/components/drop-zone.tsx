"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  isDragging: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

export function DropZone({
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  children,
}: DropZoneProps) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={cn(
        "relative w-full h-[calc(100vh-12rem)] bg-background rounded-lg",
        "transition-all duration-200 ease-in-out overflow-auto",
        isDragging && "border-2 border-dashed border-primary/50 bg-primary/5"
      )}
    >
      {children}

      {isDragging && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Upload className="w-16 h-16 mb-4 text-primary animate-bounce" />
          <p className="text-xl font-medium text-primary">Drop files here</p>
        </div>
      )}
    </div>
  );
}