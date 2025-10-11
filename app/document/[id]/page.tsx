"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CollaborativeEditor } from "@/components/editor/collaborative-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShareDialog } from "@/components/shared/share-dialog";
import { ArrowLeft, Check, Pencil, Share2 } from "lucide-react";
import type { Document } from "@/types";

export default function DocumentPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetchDocument();
    }
  }, [session, params.id]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
        setTitle(data.title);
      } else if (response.status === 404) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (content: string) => {
    try {
      await fetch(`/api/documents/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const saveTitle = async () => {
    if (!title.trim() || title === document?.title) {
      setEditingTitle(false);
      return;
    }

    try {
      await fetch(`/api/documents/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      setDocument((prev) => (prev ? { ...prev, title } : null));
      setEditingTitle(false);
    } catch (error) {
      console.error("Error saving title:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Document not found</div>
      </div>
    );
  }

  const isOwner = document.ownerId === session?.user?.id;
  const canEdit =
    isOwner ||
    document.permissions?.some(
      (p) => p.userId === session?.user?.id && p.role === "editor"
    );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {editingTitle ? (
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") {
                    setTitle(document.title);
                    setEditingTitle(false);
                  }
                }}
                autoFocus
                className="h-8"
              />
              <Button size="icon" variant="ghost" onClick={saveTitle}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{document.title}</h1>
              {canEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingTitle(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-sm text-muted-foreground">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <span className="text-sm px-3 py-1 bg-secondary rounded-full">
            {isOwner ? "Owner" : canEdit ? "Editor" : "Viewer"}
          </span>
          {isOwner && (
            <Button
              variant="outline"
              onClick={() => setShareDialogOpen(true)}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CollaborativeEditor
          documentId={params.id as string}
          initialContent={document.content}
          onSave={saveContent}
          readOnly={!canEdit}
        />
      </div>

      {/* Share Dialog */}
      {document && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          documentId={document.id}
          documentTitle={document.title}
        />
      )}
    </div>
  );
}