"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, FileText, LogOut, Trash2, Clock } from "lucide-react";
import type { Document } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [showNewDocInput, setShowNewDocInput] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchDocuments();
    }
  }, [session]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newDocTitle }),
      });

      if (response.ok) {
        const doc = await response.json();
        router.push(`/document/${doc.id}`);
      }
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setCreating(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== id));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Documents
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome back, <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* New Document Card */}
        {!showNewDocInput ? (
          <div
            className="mb-8 cursor-pointer group"
            onClick={() => setShowNewDocInput(true)}
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="p-4 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                      <Plus className="h-8 w-8 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-700 group-hover:text-indigo-700">
                      Create New Document
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Start collaborating in real-time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card className="mb-8 border-2 border-indigo-200 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={createDocument} className="flex gap-3">
                <Input
                  placeholder="Enter document title..."
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  autoFocus
                  disabled={creating}
                  className="h-12 text-lg"
                />
                <Button
                  type="submit"
                  disabled={creating || !newDocTitle.trim()}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {creating ? "Creating..." : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShowNewDocInput(false);
                    setNewDocTitle("");
                  }}
                  disabled={creating}
                >
                  Cancel
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-gray-100 rounded-full mb-6">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-2xl font-semibold text-gray-700 mb-2">
                No documents yet
              </p>
              <p className="text-gray-500">
                Create your first document to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/document/${doc.id}`)}
              >
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white shadow-md overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                        <FileText className="h-6 w-6 text-indigo-600" />
                      </div>
                      {doc.ownerId === session?.user?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDocument(doc.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <CardTitle className="line-clamp-2 text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm mt-2">
                        <Clock className="h-4 w-4" />
                        {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.ownerId === session?.user?.id
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {doc.ownerId === session?.user?.id
                          ? "Owner"
                          : doc.permissions?.[0]?.role || "Viewer"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}