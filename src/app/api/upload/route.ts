import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Ensure the uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if directory already exists
    }

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: 'Upload failed.' },
      { status: 500 }
    );
  }
}
