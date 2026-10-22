import { NextRequest, NextResponse } from 'next/server';
import { getDailyRegistrationSummary } from '@/lib/daily-summary';
import { sendDailyRegistrationSummaryEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleDailySummary(req);
}

export async function POST(req: NextRequest) {
  return handleDailySummary(req);
}

async function handleDailySummary(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const keyParam = searchParams.get('key') || searchParams.get('secret');

    // Secure the cron endpoint if CRON_SECRET is configured
    if (cronSecret) {
      const isAuthorized =
        authHeader === `Bearer ${cronSecret}` || keyParam === cronSecret;

      if (!isAuthorized) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid or missing secret key' },
          { status: 401 }
        );
      }
    }

    // Optional override for custom recipient in query param or body
    const overrideTo = searchParams.get('to') || undefined;

    // Optional override for custom date testing (e.g. ?date=2026-10-21)
    const dateParam = searchParams.get('date');
    const targetDate = dateParam ? new Date(dateParam) : new Date();

    console.log(`[Cron Daily Summary] Initiating report generation for previous day relative to ${targetDate.toISOString()}...`);

    // 1. Compute summary stats
    const summary = await getDailyRegistrationSummary(targetDate);

    // 2. Dispatch email
    const emailResult = await sendDailyRegistrationSummaryEmail(summary, {
      to: overrideTo,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to deliver summary email',
          details: emailResult.error,
          summary: {
            reportDate: summary.reportDateFormatted,
            totalYesterdayRegistrations: summary.totalYesterdayRegistrations,
            totalCumulativeRegistrations: summary.totalCumulativeRegistrations,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Daily editions registration summary email sent successfully',
      messageId: emailResult.messageId,
      reportDate: summary.reportDateFormatted,
      period: `${summary.periodStartFormatted} – ${summary.periodEndFormatted}`,
      totalYesterdayRegistrations: summary.totalYesterdayRegistrations,
      totalCumulativeRegistrations: summary.totalCumulativeRegistrations,
      activeEditionsCount: summary.totalActiveEditions,
      editions: summary.editions.map((ed) => ({
        city: ed.city,
        title: ed.title,
        yesterdayRegistrations: ed.yesterdayTotal,
        cumulativeRegistrations: ed.cumulativeTotal,
      })),
    });
  } catch (err: any) {
    console.error('[Cron Daily Summary] Exception caught:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
