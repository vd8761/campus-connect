import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminSessionToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

export async function POST(request: Request) {
  try {
    // 1. Authenticate admin user
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    const isAuthorized = await verifyAdminSessionToken(session?.value);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    // 2. Validate file type
    const mimeType = (file.type || 'image/jpeg').toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: `Invalid file type (${file.type}). Only JPEG, PNG, WEBP, and GIF images are allowed.` },
        { status: 400 }
      );
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit (8MB).' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const fileId = randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Store in PostgreSQL database (zero filesystem dependency, 100% compatible with Vercel serverless)
    try {
      if ((prisma as any).uploadedFile) {
        await (prisma as any).uploadedFile.create({
          data: {
            id: fileId,
            filename: safeName,
            mimeType,
            data: base64Data,
            size: file.size,
          },
        });
      } else {
        throw new Error('Prisma uploadedFile model not yet on client instance');
      }
    } catch {
      await prisma.$executeRawUnsafe(
        'INSERT INTO "UploadedFile" ("id", "filename", "mimeType", "data", "size", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
        fileId,
        safeName,
        mimeType,
        base64Data,
        file.size
      );
    }

    const fileUrl = `/api/files/${fileId}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Upload failed.' },
      { status: 500 }
    );
  }
}
