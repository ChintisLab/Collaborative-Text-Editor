export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: User;
  permissions?: DocumentPermission[];
}

export interface DocumentPermission {
  id: string;
  documentId: string;
  userId: string;
  role: "owner" | "editor" | "viewer";
  createdAt: Date;
  user?: User;
}

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  color: string;
}