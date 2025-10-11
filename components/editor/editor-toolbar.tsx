"use client";

import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Code,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="flex flex-wrap gap-1 p-3 max-w-5xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
          className="hover:bg-indigo-50 hover:text-indigo-700"
        >
          <Undo className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          className="hover:bg-indigo-50 hover:text-indigo-700"
        >
          <Redo className="h-5 w-5" />
        </Button>

        <div className="w-px h-9 bg-gray-300 mx-2" />

        <Button
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
          className={editor.isActive("bold") ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-indigo-50 hover:text-indigo-700"}
        >
          <Bold className="h-5 w-5" />
        </Button>
        <Button
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
          className={editor.isActive("italic") ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-indigo-50 hover:text-indigo-700"}
        >
          <Italic className="h-5 w-5" />
        </Button>
        <Button
          variant={editor.isActive("code") ? "default" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Code"
          className={editor.isActive("code") ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-indigo-50 hover:text-indigo-700"}
        >
          <Code className="h-5 w-5" />
        </Button>

        <div className="w-px h-9 bg-gray-300 mx-2" />

        <Button
          variant={
            editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
          }
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant={
            editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
          }
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant={
            editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
          }
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}