import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const mobile = searchParams.get('mobile');

  if (!email && !mobile) {
    return NextResponse.json(
      { error: 'Email or mobile parameter is required' },
      { status: 400 }
    );
  }

  try {
    const participant = await prisma.participant.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(mobile ? [{ mobile }] : [])
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

    return NextResponse.json({
      success: true,
      participant
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
