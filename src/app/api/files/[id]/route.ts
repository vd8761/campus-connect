import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse('File ID required', { status: 400 });
    }

    // Query file from database (supports both prisma client model and raw query fallback)
    let fileRecord: { mimeType: string; data: string; filename: string } | null = null;

    try {
      if ((prisma as any).uploadedFile) {
        fileRecord = await (prisma as any).uploadedFile.findUnique({
          where: { id },
          select: { mimeType: true, data: true, filename: true },
        });
      }
    } catch {
      // Fallback to raw query
    }

    if (!fileRecord) {
      const rows: any = await prisma.$queryRawUnsafe(
        'SELECT "mimeType", "data", "filename" FROM "UploadedFile" WHERE "id" = $1 LIMIT 1',
        id
      );
      if (rows && rows.length > 0) {
        fileRecord = rows[0];
      }
    }

    if (!fileRecord) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const buffer = Buffer.from(fileRecord.data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': fileRecord.mimeType || 'image/jpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
