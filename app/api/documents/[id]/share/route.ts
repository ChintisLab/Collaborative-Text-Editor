import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // Verify user is owner
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (document.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Only document owner can share" },
        { status: 403 }
      );
    }

    // Find user by email
    const userToShare = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToShare) {
      return NextResponse.json(
        { error: "User not found. They need to create an account first." },
        { status: 404 }
      );
    }

    // Check if permission already exists
    const existingPermission = await prisma.documentPermission.findUnique({
      where: {
        documentId_userId: {
          documentId: id,
          userId: userToShare.id,
        },
      },
    });

    if (existingPermission) {
      // Update existing permission
      await prisma.documentPermission.update({
        where: { id: existingPermission.id },
        data: { role },
      });
    } else {
      // Create new permission
      await prisma.documentPermission.create({
        data: {
          documentId: id,
          userId: userToShare.id,
          role,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Document shared with ${email} as ${role}`,
    });
  } catch (error) {
    console.error("Error sharing document:", error);
    return NextResponse.json(
      { error: "Failed to share document" },
      { status: 500 }
    );
  }
}