"use client";

import { useState, useCallback } from "react";
import { Position } from "@/types/document";

interface CanvasState {
  scale: number;
  position: Position;
  isGridEnabled: boolean;
  gridSize: number;
}

export function useCanvasState() {
  const [state, setState] = useState<CanvasState>({
    scale: 1,
    position: { x: 0, y: 0 },
    isGridEnabled: false,
    gridSize: 20,
  });

  const zoom = useCallback((delta: number) => {
    setState((prev) => ({
      ...prev,
      scale: Math.max(0.25, Math.min(2, prev.scale + delta)),
    }));
  }, []);

  const pan = useCallback((dx: number, dy: number) => {
    setState((prev) => ({
      ...prev,
      position: {
        x: prev.position.x + dx,
        y: prev.position.y + dy,
      },
    }));
  }, []);

  const toggleGrid = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isGridEnabled: !prev.isGridEnabled,
    }));
  }, []);

  const snapToGrid = useCallback((position: Position): Position => {
    if (!state.isGridEnabled) return position;
    return {
      x: Math.round(position.x / state.gridSize) * state.gridSize,
      y: Math.round(position.y / state.gridSize) * state.gridSize,
    };
  }, [state.isGridEnabled, state.gridSize]);

  return {
    state,
    zoom,
    pan,
    toggleGrid,
    snapToGrid,
  };
}