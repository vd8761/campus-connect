import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, eventSlug, source, campaign, qrCode, schoolName, city, pageUrl, metadata } = body;

    // Log structured analytics event for operational review
    console.log(`[CampusSquare Analytics] ${eventType}`, {
      eventSlug,
      source: source || 'direct',
      campaign: campaign || 'organic',
      qrCode: qrCode || 'none',
      schoolName,
      city,
      pageUrl,
      timestamp: new Date().toISOString(),
      metadata,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Analytics API Error]", err);
    return NextResponse.json({ success: false, error: "Tracking error" }, { status: 500 });
  }
}
