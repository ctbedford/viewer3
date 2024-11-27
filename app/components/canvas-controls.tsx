"use client";

import { ZoomIn, ZoomOut, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

interface CanvasControlsProps {
  scale: number;
  isGridEnabled: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
}

export function CanvasControls({
  scale,
  isGridEnabled,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
}: CanvasControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        disabled={scale <= 0.25}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="min-w-[3rem] text-center">
        {Math.round(scale * 100)}%
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        disabled={scale >= 2}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Toggle
        pressed={isGridEnabled}
        onPressedChange={onToggleGrid}
        aria-label="Toggle grid"
      >
        <Grid className="h-4 w-4" />
      </Toggle>
    </div>
  );
}