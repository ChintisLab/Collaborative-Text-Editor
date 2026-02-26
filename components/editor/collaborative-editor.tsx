"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { getUserColor } from "@/lib/yjs/colors";
import { useSession } from "next-auth/react";
import { EditorToolbar } from "./editor-toolbar";
import { ActiveUsers } from "./active-users";

interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
}

export function CollaborativeEditor({
  documentId,
  initialContent,
  onSave,
  readOnly = false,
}: CollaborativeEditorProps) {
  const { data: session } = useSession();
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [ydoc] = useState(() => new Y.Doc());
  const [users, setUsers] = useState<any[]>([]);

  // Set up provider first
  useEffect(() => {
    if (!session?.user) return;

    // Set up WebSocket provider for real-time collaboration
    const defaultWebSocketUrl =
      typeof window !== "undefined"
        ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`
        : "ws://localhost:1234";

    const wsProvider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WS_URL || defaultWebSocketUrl,
      documentId,
      ydoc
    );

    // Set up IndexedDB persistence for offline support
    const indexeddbProvider = new IndexeddbPersistence(documentId, ydoc);

    let initialContentLoaded = false;

    indexeddbProvider.on("synced", () => {
      console.log("IndexedDB content loaded");
      // If IndexedDB is empty and we have initial content from database, load it
      if (!initialContentLoaded && initialContent) {
        const xmlFragment = ydoc.getXmlFragment("default");
        if (xmlFragment.length === 0) {
          console.log("Loading initial content from database");
          initialContentLoaded = true;
        }
      }
    });

    wsProvider.on("sync", (isSynced: boolean) => {
      if (!isSynced) return;

      console.log("WebSocket synced");
      // After syncing with server, if document is still empty, load from database
      if (!initialContentLoaded && initialContent) {
        const xmlFragment = ydoc.getXmlFragment("default");
        if (xmlFragment.length === 0) {
          console.log("Document empty after sync, loading from database");
          initialContentLoaded = true;
        }
      }
    });

    wsProvider.on("status", (event: any) => {
      console.log("WebSocket status:", event.status);
    });

    // Track connected users
    wsProvider.awareness.on("change", () => {
      const states = Array.from(wsProvider.awareness.getStates().values());
      setUsers(states.filter((state: any) => state.user));
    });

    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
      indexeddbProvider.destroy();
    };
  }, [documentId, ydoc, session, initialContent]);

  // Create editor after provider is ready
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      ...(provider
        ? [
            CollaborationCursor.configure({
              provider: provider,
              user: {
                name: session?.user?.name || session?.user?.email || "Anonymous",
                color: session?.user?.id
                  ? getUserColor(session.user.id)
                  : "#4F46E5",
              },
            }),
          ]
        : []),
      Placeholder.configure({
        placeholder: "Start typing your document...",
      }),
    ],
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none",
      },
    },
  }, [provider, session, ydoc, readOnly]);

  // Load initial content from database
  useEffect(() => {
    if (!editor || !provider || !initialContent) return;

    // Wait a bit for Yjs to sync, then check if we need to load initial content
    const timeout = setTimeout(() => {
      const currentContent = editor.getHTML();
      // If editor is empty or only has placeholder, load initial content
      if (currentContent === "<p></p>" || currentContent.trim() === "") {
        console.log("Loading initial content:", initialContent);
        editor.commands.setContent(initialContent);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [editor, provider, initialContent]);

  // Auto-save functionality
  useEffect(() => {
    if (!editor || !onSave) return;

    const saveInterval = setInterval(() => {
      const content = editor.getHTML();
      onSave(content);
    }, 2000); // Save every 2 seconds

    return () => clearInterval(saveInterval);
  }, [editor, onSave]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {!readOnly && <EditorToolbar editor={editor} />}
      <div className="flex-1 overflow-y-auto bg-background">
        <EditorContent editor={editor} className="h-full" />
      </div>
      <ActiveUsers users={users} />
    </div>
  );
}