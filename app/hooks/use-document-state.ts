"use client";

import { useState, useCallback } from "react";
import { Document, Connection, Position } from "@/types/document";

interface DocumentState {
  documents: Document[];
  connections: Connection[];
  selectedDocuments: Set<string>;
  searchQuery: string;
}

export function useDocumentState() {
  const [state, setState] = useState<DocumentState>({
    documents: [],
    connections: [],
    selectedDocuments: new Set(),
    searchQuery: "",
  });

  const addDocuments = useCallback((files: File[], position: Position) => {
    setState((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        ...files.map((file, index) => ({
          id: `${Date.now()}-${index}`,
          name: file.name,
          type: file.type,
          size: file.size,
          position: {
            x: position.x + index * 20,
            y: position.y + index * 20,
          },
          connections: [],
          createdAt: new Date().toISOString(),
        })),
      ],
    }));
  }, []);

  const createNewDocument = useCallback(() => {
    const newDoc: Document = {
      id: `${Date.now()}`,
      name: "New Document.txt",
      type: "text/plain",
      content: "",
      position: { x: 100, y: 100 },
      connections: [],
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));

    return newDoc.id;
  }, []);

  const updatePosition = useCallback((id: string, position: Position) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) =>
        doc.id === id ? { ...doc, position } : doc
      ),
    }));
  }, []);

  const updateContent = useCallback((id: string, content: string) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) =>
        doc.id === id
          ? { ...doc, content, updatedAt: new Date().toISOString() }
          : doc
      ),
    }));
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
      connections: prev.connections.filter(
        (conn) => conn.from !== id && conn.to !== id
      ),
      selectedDocuments: new Set(
        Array.from(prev.selectedDocuments).filter((docId) => docId !== id)
      ),
    }));
  }, []);

  const addConnection = useCallback((from: string, to: string) => {
    setState((prev) => ({
      ...prev,
      connections: [...prev.connections, { from, to }],
    }));
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setState((prev) => {
      const newSelection = new Set(prev.selectedDocuments);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return { ...prev, selectedDocuments: newSelection };
    });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  return {
    state,
    addDocuments,
    createNewDocument,
    updatePosition,
    updateContent,
    deleteDocument,
    addConnection,
    toggleSelection,
    setSearchQuery,
  };
}