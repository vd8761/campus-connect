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

    const body = await req.json();
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
    } = body;

    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;
    const normalizedMobile = mobile ? String(mobile).replace(/\D/g, '') : null;

    if (!normalizedEmail && !normalizedMobile) {
      return NextResponse.json(
        { success: false, error: 'Email or mobile is required' },
        { status: 400 }
      );
    }

    // Find the participant in Campus Connect
    let participant = null;
    if (normalizedEmail) {
      participant = await prisma.participant.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      });
    }

    if (!participant && normalizedMobile) {
      participant = await prisma.participant.findFirst({
        where: {
          mobile: { contains: normalizedMobile.slice(-10) },
        },
      });
    }

    if (!participant) {
      return NextResponse.json(
        { success: false, error: 'Participant not found in Campus Square database' },
        { status: 404 }
      );
    }

    // Upsert into AssessmentResult
    const assessmentResult = await prisma.assessmentResult.upsert({
      where: { participantId: participant.id },
      create: {
        participantId: participant.id,
        scoreD: Number(scoreD) || 0,
        scoreI: Number(scoreI) || 0,
        scoreS: Number(scoreS) || 0,
        scoreC: Number(scoreC) || 0,
        primaryTrait: String(primaryTrait || 'Unknown'),
        profileType: String(profileType || 'General Style'),
        skillDocumentUrl: skillDocumentUrl || null,
        completedAt: new Date(),
      },
      update: {
        scoreD: Number(scoreD) || 0,
        scoreI: Number(scoreI) || 0,
        scoreS: Number(scoreS) || 0,
        scoreC: Number(scoreC) || 0,
        primaryTrait: String(primaryTrait || 'Unknown'),
        profileType: String(profileType || 'General Style'),
        skillDocumentUrl: skillDocumentUrl || null,
        completedAt: new Date(),
      },
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
