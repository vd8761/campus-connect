import prisma from '@/lib/prisma';
import { getEventStatus } from './event-utils';
import { ORIGINBI_ASSESSMENT_AMOUNT } from './constants';

export interface ParticipantSummaryItem {
  fullName: string;
  category: string;
  board?: string | null;
  schoolLevel?: string | null;
  city?: string | null;
  createdAt: Date;
  timeFormatted: string;
}

export interface EditionSummaryItem {
  id: string;
  title: string;
  slug: string;
  city: string;
  edition?: string | null;
  venue?: string | null;
  isDateTba: boolean;
  isVenueTba: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  status: string;
  displayStatus: string;
  maxCapacity: number;

  // Yesterday's activity
  yesterdayTotal: number;
  yesterdayStudents: number;
  yesterdayParents: number;
  yesterdayEducators: number;
  yesterdayOthers: number;

  // Cumulative all-time
  cumulativeTotal: number;
  capacityPercentage: number;

  // Roster of yesterday's attendees (up to 10 for email preview)
  yesterdayParticipants: ParticipantSummaryItem[];
}

export interface DailySummaryData {
  reportDateFormatted: string; // e.g. "Wednesday, 21 October 2026"
  periodStartFormatted: string; // e.g. "21 Oct 2026, 00:00 IST"
  periodEndFormatted: string;   // e.g. "21 Oct 2026, 23:59 IST"
  generatedAtFormatted: string; // e.g. "22 Oct 2026, 08:30 IST"

  totalYesterdayRegistrations: number;
  totalYesterdayStudents: number;
  totalYesterdayParents: number;
  totalYesterdayEducators: number;
  totalYesterdayOthers: number;

  totalCumulativeRegistrations: number;
  totalActiveEditions: number;
  totalAssessmentsValueYesterday: number;

  editions: EditionSummaryItem[];
  allYesterdayParticipants: (ParticipantSummaryItem & { eventTitle: string; eventCity: string })[];
}

/**
 * Calculates start and end of previous day in Indian Standard Time (UTC+5:30)
 */
export function getPreviousDayBounds(referenceDate: Date = new Date(), offsetHours: number = 5.5) {
  const utcMillis = referenceDate.getTime();
  const tzMillis = utcMillis + offsetHours * 3600 * 1000;
  const tzDate = new Date(tzMillis);

  const yesterdayYear = tzDate.getUTCFullYear();
  const yesterdayMonth = tzDate.getUTCMonth();
  const yesterdayDay = tzDate.getUTCDate() - 1;

  const startTzMillis = Date.UTC(yesterdayYear, yesterdayMonth, yesterdayDay, 0, 0, 0, 0);
  const startUtcDate = new Date(startTzMillis - offsetHours * 3600 * 1000);

  const endTzMillis = Date.UTC(yesterdayYear, yesterdayMonth, yesterdayDay, 23, 59, 59, 999);
  const endUtcDate = new Date(endTzMillis - offsetHours * 3600 * 1000);

  const displayDate = new Date(startTzMillis);
  const reportDateFormatted = displayDate.toLocaleDateString('en-IN', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const periodStartFormatted = `${displayDate.toLocaleDateString('en-IN', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' })}, 00:00 IST`;
  const periodEndFormatted = `${displayDate.toLocaleDateString('en-IN', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' })}, 23:59 IST`;

  const nowTz = new Date(utcMillis + offsetHours * 3600 * 1000);
  const generatedAtFormatted = nowTz.toLocaleDateString('en-IN', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) + ' IST';

  return {
    startUtcDate,
    endUtcDate,
    reportDateFormatted,
    periodStartFormatted,
    periodEndFormatted,
    generatedAtFormatted,
  };
}

/**
 * Aggregates registration numbers for the previous day, broken down by Edition
 */
export async function getDailyRegistrationSummary(targetDate?: Date): Promise<DailySummaryData> {
  const {
    startUtcDate,
    endUtcDate,
    reportDateFormatted,
    periodStartFormatted,
    periodEndFormatted,
    generatedAtFormatted,
  } = getPreviousDayBounds(targetDate);

  // Fetch all events with their registrations
  const rawEvents = await prisma.event.findMany({
    orderBy: [
      { startDate: 'asc' },
      { createdAt: 'asc' }
    ],
    include: {
      registrations: {
        include: {
          participant: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  let totalYesterdayRegistrations = 0;
  let totalYesterdayStudents = 0;
  let totalYesterdayParents = 0;
  let totalYesterdayEducators = 0;
  let totalYesterdayOthers = 0;
  let totalCumulativeRegistrations = 0;
  let totalActiveEditions = 0;

  const allYesterdayParticipants: (ParticipantSummaryItem & { eventTitle: string; eventCity: string })[] = [];

  const editions: EditionSummaryItem[] = rawEvents.map(event => {
    const dynamicStatus = getEventStatus(
      event.startDate,
      event.endDate,
      event.registrationOpen,
      event.registrationClose,
      event.status === 'DRAFT',
      event.isDateTba
    );

    const displayStatus = event.status === 'LIMITED_SEATS' ? 'LIMITED_SEATS' : dynamicStatus;
    if (['OPEN', 'LIMITED_SEATS', 'OPENING_SOON'].includes(displayStatus)) {
      totalActiveEditions++;
    }

    const cumulativeTotal = event.registrations.length;
    totalCumulativeRegistrations += cumulativeTotal;

    // Filter registrations that occurred during yesterday's window
    const yesterdayRegs = event.registrations.filter(r => {
      const created = new Date(r.createdAt);
      return created >= startUtcDate && created <= endUtcDate;
    });

    const yesterdayTotal = yesterdayRegs.length;
    totalYesterdayRegistrations += yesterdayTotal;

    let yesterdayStudents = 0;
    let yesterdayParents = 0;
    let yesterdayEducators = 0;
    let yesterdayOthers = 0;

    const yesterdayParticipants: ParticipantSummaryItem[] = [];

    yesterdayRegs.forEach(reg => {
      const cat = (reg.participant.category || '').toLowerCase();
      if (cat.includes('student')) {
        yesterdayStudents++;
        totalYesterdayStudents++;
      } else if (cat.includes('parent')) {
        yesterdayParents++;
        totalYesterdayParents++;
      } else if (cat.includes('educator') || cat.includes('teacher') || cat.includes('leader')) {
        yesterdayEducators++;
        totalYesterdayEducators++;
      } else {
        yesterdayOthers++;
        totalYesterdayOthers++;
      }

      // Convert timestamp to IST 12-hour format
      const istTime = new Date(new Date(reg.createdAt).getTime() + 5.5 * 3600 * 1000);
      const timeFormatted = istTime.toLocaleTimeString('en-IN', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const participantItem: ParticipantSummaryItem = {
        fullName: reg.participant.fullName || 'Anonymous Attendee',
        category: reg.participant.category || 'Participant',
        board: reg.participant.board || null,
        schoolLevel: reg.participant.schoolLevel || null,
        city: reg.participant.city || event.city,
        createdAt: reg.createdAt,
        timeFormatted,
      };

      yesterdayParticipants.push(participantItem);
      allYesterdayParticipants.push({
        ...participantItem,
        eventTitle: event.title,
        eventCity: event.city,
      });
    });

    const maxCap = event.maxCapacity || 0;
    const capacityPercentage = maxCap > 0 ? Math.min(100, Math.round((cumulativeTotal / maxCap) * 100)) : 0;

    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      city: event.city,
      edition: event.edition,
      venue: event.venue,
      isDateTba: event.isDateTba,
      isVenueTba: event.isVenueTba,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
      displayStatus,
      maxCapacity: maxCap,
      yesterdayTotal,
      yesterdayStudents,
      yesterdayParents,
      yesterdayEducators,
      yesterdayOthers,
      cumulativeTotal,
      capacityPercentage,
      yesterdayParticipants,
    };
  });

  // Calculate monetary assessment value delivered to students yesterday
  const assessmentUnitValue = parseInt(String(ORIGINBI_ASSESSMENT_AMOUNT).replace(/[^0-9]/g, '')) || 1500;
  const totalAssessmentsValueYesterday = totalYesterdayStudents * assessmentUnitValue;

  return {
    reportDateFormatted,
    periodStartFormatted,
    periodEndFormatted,
    generatedAtFormatted,
    totalYesterdayRegistrations,
    totalYesterdayStudents,
    totalYesterdayParents,
    totalYesterdayEducators,
    totalYesterdayOthers,
    totalCumulativeRegistrations,
    totalActiveEditions,
    totalAssessmentsValueYesterday,
    editions,
    allYesterdayParticipants,
  };
}
