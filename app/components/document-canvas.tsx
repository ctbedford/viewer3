"use client";

import { useCallback, useState, useRef } from "react";
import { useDocumentState } from "@/app/hooks/use-document-state";
import { useCanvasState } from "@/app/hooks/use-canvas-state";
import { ConnectionLines } from "@/app/components/connection-lines";
import { CanvasControls } from "@/app/components/canvas-controls";
import { Toolbar } from "@/app/components/toolbar";
import { DropZone } from "@/app/components/drop-zone";
import { FileGrid } from "@/app/components/file-grid";
import { DocumentEditor } from "@/app/components/document-editor";

export function DocumentCanvas() {
  const {
    state: { documents, connections, selectedDocuments, searchQuery },
    addDocuments,
    createNewDocument,
    updatePosition,
    updateContent,
    deleteDocument,
    addConnection,
    toggleSelection,
    setSearchQuery,
  } = useDocumentState();

  const {
    state: { scale, position, isGridEnabled },
    zoom,
    pan,
    toggleGrid,
    snapToGrid,
  } = useCanvasState();

  const [isDragging, setIsDragging] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const dropX = (e.clientX - canvasRect.left - position.x) / scale;
      const dropY = (e.clientY - canvasRect.top - position.y) / scale;
      const files = Array.from(e.dataTransfer.files);

      addDocuments(files, snapToGrid({ x: dropX, y: dropY }));
    },
    [addDocuments, position, scale, snapToGrid]
  );

  const handleDocumentDrag = useCallback(
    (id: string, e: React.DragEvent) => {
      const { movementX, movementY } = e;
      const doc = documents.find((d) => d.id === id);
      if (doc) {
        const newPosition = snapToGrid({
          x: doc.position.x + movementX / scale,
          y: doc.position.y + movementY / scale,
        });
        updatePosition(id, newPosition);
      }
    },
    [documents, scale, snapToGrid, updatePosition]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoom(e.deltaY > 0 ? -0.1 : 0.1);
      } else {
        pan(-e.deltaX, -e.deltaY);
      }
    },
    [zoom, pan]
  );

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)]">
      <Toolbar onSearch={setSearchQuery} onCreateNew={createNewDocument} />

      <div
        ref={canvasRef}
        className="relative h-full overflow-hidden bg-background rounded-lg"
        onWheel={handleWheel}
      >
        <DropZone
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
        >
          <div
            className="absolute inset-0 transition-transform duration-200"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            <ConnectionLines documents={documents} connections={connections} />
            <FileGrid
              documents={filteredDocuments}
              selectedDocuments={selectedDocuments}
              onSelect={toggleSelection}
              onDelete={deleteDocument}
              onDrag={handleDocumentDrag}
              onStartConnection={(id) => {
                if (connectingFrom === null) {
                  setConnectingFrom(id);
                } else if (connectingFrom !== id) {
                  addConnection(connectingFrom, id);
                  setConnectingFrom(null);
                }
              }}
              onEdit={setEditingDocument}
            />
          </div>
        </DropZone>

        <CanvasControls
          scale={scale}
          isGridEnabled={isGridEnabled}
          onZoomIn={() => zoom(0.1)}
          onZoomOut={() => zoom(-0.1)}
          onToggleGrid={toggleGrid}
        />

        {editingDocument && (
          <div className="absolute inset-4 bg-background rounded-lg shadow-lg overflow-hidden">
            <DocumentEditor
              document={documents.find((d) => d.id === editingDocument)!}
              onSave={updateContent}
              onClose={() => setEditingDocument(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}