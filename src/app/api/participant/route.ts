import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyTurnstileToken } from '@/lib/turnstile';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const mobile = searchParams.get('mobile');
  const token = searchParams.get('token');
  const eventId = searchParams.get('eventId');

  if (!email && !mobile) {
    return NextResponse.json(
      { error: 'Email or mobile parameter is required' },
      { status: 400 }
    );
  }

  if (!token) {
    return NextResponse.json(
      { error: 'Security token is missing' },
      { status: 403 }
    );
  }

  try {
    // Verify Turnstile Token
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const turnstileCheck = await verifyTurnstileToken(token, {
      action: 'participant_lookup',
      remoteIp: clientIp,
    });
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { error: turnstileCheck.error || 'Security check failed' },
        { status: 403 }
      );
    }

    let mobileQueries: any[] = [];
    if (mobile) {
      mobileQueries.push({ mobile });
      
      const digits = mobile.replace(/\D/g, "");
      if (digits.length === 10) {
        // Typed 10 digits
        mobileQueries.push({ mobile: `+91${digits}` });
        mobileQueries.push({ mobile: digits });
      } else if (digits.length === 12 && digits.startsWith('91')) {
        // Typed 12 digits starting with 91
        const ten = digits.substring(2);
        mobileQueries.push({ mobile: `+91${ten}` });
        mobileQueries.push({ mobile: ten });
      } else if (digits.length === 11 && digits.startsWith('0')) {
        // Typed 11 digits starting with 0
        const ten = digits.substring(1);
        mobileQueries.push({ mobile: `+91${ten}` });
        mobileQueries.push({ mobile: ten });
      }
    }

    const participant = await prisma.participant.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...mobileQueries
        ]
      },
      include: {
        organization: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    if (!participant) {
      return NextResponse.json({ success: false, message: 'Participant not found' }, { status: 404 });
    }

    let isRegistered = false;
    if (participant && eventId) {
      const registration = await prisma.eventRegistration.findUnique({
        where: {
          eventId_participantId: {
            eventId,
            participantId: participant.id
          }
        }
      });
      if (registration) {
        isRegistered = true;
      }
    }

    return NextResponse.json({
      success: true,
      participant,
      isRegistered
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
