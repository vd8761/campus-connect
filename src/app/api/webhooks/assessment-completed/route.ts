import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Optional secret token verification
    const webhookSecret = process.env.ORIGINBI_WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader =
        req.headers.get('x-webhook-secret') ||
        req.headers.get('authorization')?.replace('Bearer ', '');
      if (authHeader !== webhookSecret) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized webhook request' },
          { status: 401 }
        );
      }
    }

    let body: any;
    try {
      body = await req.json();
    } catch (parseError: any) {
      console.warn('Webhook received invalid or malformed JSON:', parseError?.message);
      return NextResponse.json(
        { success: false, error: `Invalid JSON payload: ${parseError?.message}` },
        { status: 400 }
      );
    }

    const {
      email,
      mobile,
      scoreD,
      scoreI,
      scoreS,
      scoreC,
      primaryTrait,
      profileType,
      skillDocumentUrl,
    } = body || {};

    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;
    const normalizedMobile = mobile ? String(mobile).replace(/\D/g, '') : null;

    if (!normalizedEmail && !normalizedMobile) {
      return NextResponse.json(
        { success: false, error: 'Email or mobile is required' },
        { status: 400 }
      );
    }

    // Helper for Neon DB retry on P1017
    const executeWithRetry = async <T>(operation: () => Promise<T>): Promise<T> => {
      try {
        return await operation();
      } catch (dbErr: any) {
        if (dbErr.code === 'P1017' || dbErr?.message?.includes('closed the connection')) {
          console.warn('Neon connection dropped (P1017). Reconnecting and retrying...');
          try {
            await prisma.$disconnect();
          } catch (_) {}
          await prisma.$connect();
          return await operation();
        }
        throw dbErr;
      }
    };

    // Find the participant in Campus Square
    const participant = await executeWithRetry(async () => {
      if (normalizedEmail) {
        const found = await prisma.participant.findFirst({
          where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
        });
        if (found) return found;
      }

      if (normalizedMobile) {
        return await prisma.participant.findFirst({
          where: {
            mobile: { contains: normalizedMobile.slice(-10) },
          },
        });
      }
      return null;
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, error: 'Participant not found in Campus Square database' },
        { status: 404 }
      );
    }

    // Upsert into AssessmentResult with retry on P1017 connection dropped
    const upsertData = {
      scoreD: Number(scoreD) || 0,
      scoreI: Number(scoreI) || 0,
      scoreS: Number(scoreS) || 0,
      scoreC: Number(scoreC) || 0,
      primaryTrait: String(primaryTrait || 'Unknown'),
      profileType: String(profileType || 'General Style'),
      skillDocumentUrl: skillDocumentUrl || null,
      completedAt: new Date(),
    };

    const assessmentResult = await executeWithRetry(async () => {
      return await prisma.assessmentResult.upsert({
        where: { participantId: participant.id },
        create: {
          participantId: participant.id,
          ...upsertData,
        },
        update: upsertData,
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment result successfully recorded in Campus Square',
      participantId: participant.id,
      assessmentResultId: assessmentResult.id,
    });
  } catch (error: any) {
    console.error('Error handling assessment-completed webhook:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
