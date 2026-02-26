"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check, Share2, Users } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentTitle: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  documentId,
  documentTitle,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [sharing, setSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const shareUrl = `${window.location.origin}/document/${documentId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSharing(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      if (response.ok) {
        setShareSuccess(true);
        setEmail("");
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to share document");
      }
    } catch (error) {
      alert("Failed to share document");
    } finally {
      setSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Share2 className="h-5 w-5 text-indigo-600" />
            </div>
            <DialogTitle className="text-2xl">Share Document</DialogTitle>
          </div>
          <DialogDescription>
            Share &quot;{documentTitle}&quot; with others to collaborate in real-time
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Anyone with the link
            </Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <Button
                type="button"
                variant="outline"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Anyone with this link can view the document
            </p>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-semibold mb-3 block">
              Invite by email
            </Label>
            <form onSubmit={handleShare} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sharing}
                  className="flex-1"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "editor" | "viewer")}
                  disabled={sharing}
                  className="px-3 py-2 border rounded-md bg-white text-sm"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <Button
                type="submit"
                disabled={sharing || !email.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {sharing ? "Sharing..." : "Send Invite"}
              </Button>
              {shareSuccess && (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Invite sent successfully!
                </p>
              )}
            </form>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}