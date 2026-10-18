'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Normalizes phone numbers for flexible search (handles with/without +91, spaces, hyphens)
 */
function getPhoneVariants(input: string): string[] {
  const digits = input.replace(/\D/g, '');
  const variants = new Set<string>();

  if (input.trim()) {
    variants.add(input.trim());
  }

  if (digits) {
    variants.add(digits);
    variants.add(`+${digits}`);

    // If 10 digits (India standard), add +91 and 91 variants
    if (digits.length === 10) {
      variants.add(`+91${digits}`);
      variants.add(`91${digits}`);
    }

    // If 12 digits starting with 91
    if (digits.length === 12 && digits.startsWith('91')) {
      const tenDigit = digits.slice(2);
      variants.add(tenDigit);
      variants.add(`+91${tenDigit}`);
    }
  }

  return Array.from(variants);
}

/**
 * Fetch active fair events for the booth searchable autocomplete
 */
export async function getEventsForBooths() {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        city: true,
        venue: true,
        startDate: true,
        status: true,
        _count: {
          select: { universityEvents: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return {
      success: true,
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        city: e.city,
        venue: e.venue || e.city,
        startDate: e.startDate ? e.startDate.toISOString() : null,
        status: e.status,
        universitiesCount: e._count.universityEvents,
      })),
    };
  } catch (error) {
    console.error('Error fetching events for booths:', error);
    return { success: false, events: [] };
  }
}

/**
 * Look up a registered participant by Mobile Number or Email ID, optionally for a specific chosen event
 */
export async function lookupParticipantForBooths(identifier: string, chosenEventId?: string) {
  try {
    const trimmed = identifier.trim();
    if (!trimmed) {
      return { success: false, error: 'Please enter your registered mobile number or email ID.' };
    }

    const isEmail = trimmed.includes('@');
    let participant: any = null;

    if (isEmail) {
      participant = await prisma.participant.findFirst({
        where: {
          email: {
            equals: trimmed,
            mode: 'insensitive',
          },
        },
        include: {
          registrations: {
            include: {
              event: {
                include: {
                  universityEvents: {
                    include: {
                      university: {
                        include: {
                          courses: {
                            where: { isActive: true },
                            select: { id: true, name: true, category: true, level: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          boothVisits: {
            include: {
              university: true,
            },
          },
        },
      });
    } else {
      const phoneVariants = getPhoneVariants(trimmed);

      participant = await prisma.participant.findFirst({
        where: {
          OR: phoneVariants.map((p) => ({
            mobile: {
              equals: p,
            },
          })),
        },
        include: {
          registrations: {
            include: {
              event: {
                include: {
                  universityEvents: {
                    include: {
                      university: {
                        include: {
                          courses: {
                            where: { isActive: true },
                            select: { id: true, name: true, category: true, level: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          boothVisits: {
            include: {
              university: true,
            },
          },
        },
      });
    }

    if (!participant) {
      return {
        success: false,
        error: `No university fair registration found for "${trimmed}". Please make sure you entered the mobile number or email used during registration.`,
      };
    }

    // Extract all registered events with their participating/eligible universities
    const events = (participant.registrations || []).map((reg: any) => {
      const ev = reg.event;
      const participatingUniversities = (ev.universityEvents || [])
        .map((ue: any) => ({
          id: ue.university.id,
          name: ue.university.name,
          city: ue.university.city || 'India',
          logoUrl: ue.university.logoUrl,
          description: ue.university.description,
          boothNumber: ue.boothNumber,
          coursesCount: (ue.university.courses || []).length,
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      // Existing visits for this specific event
      const visitedUniIds = (participant.boothVisits || [])
        .filter((bv: any) => bv.eventId === ev.id)
        .map((bv: any) => bv.universityId);

      return {
        id: ev.id,
        title: ev.title,
        slug: ev.slug,
        venue: ev.venue,
        city: ev.city,
        startDate: ev.startDate,
        participatingUniversities,
        visitedUniIds,
      };
    });

    // If chosenEventId was selected, ensure it is included and placed first
    if (chosenEventId) {
      const existingIdx = events.findIndex((e: any) => e.id === chosenEventId);
      if (existingIdx >= 0) {
        const [target] = events.splice(existingIdx, 1);
        events.unshift(target);
      } else {
        const targetEvent = await prisma.event.findUnique({
          where: { id: chosenEventId },
          include: {
            universityEvents: {
              include: {
                university: {
                  include: {
                    courses: { where: { isActive: true }, select: { id: true, name: true, category: true, level: true } },
                  },
                },
              },
            },
          },
        });

        if (targetEvent) {
          try {
            await prisma.eventRegistration.upsert({
              where: {
                eventId_participantId: {
                  eventId: targetEvent.id,
                  participantId: participant.id,
                },
              },
              create: {
                registrationId: 'REG-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                eventId: targetEvent.id,
                participantId: participant.id,
                status: 'CONFIRMED',
              },
              update: {},
            });
          } catch (e) {
            // Silently continue if registration already exists
          }

          const participatingUniversities = (targetEvent.universityEvents || [])
            .map((ue: any) => ({
              id: ue.university.id,
              name: ue.university.name,
              city: ue.university.city || 'India',
              logoUrl: ue.university.logoUrl,
              description: ue.university.description,
              boothNumber: ue.boothNumber,
              coursesCount: (ue.university.courses || []).length,
            }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));

          const visitedUniIds = (participant.boothVisits || [])
            .filter((bv: any) => bv.eventId === targetEvent.id)
            .map((bv: any) => bv.universityId);

          events.unshift({
            id: targetEvent.id,
            title: targetEvent.title,
            slug: targetEvent.slug,
            venue: targetEvent.venue,
            city: targetEvent.city,
            startDate: targetEvent.startDate,
            participatingUniversities,
            visitedUniIds,
          });
        }
      }
    }

    return {
      success: true,
      participant: {
        id: participant.id,
        fullName: participant.fullName,
        email: participant.email,
        mobile: participant.mobile,
        schoolLevel: participant.schoolLevel,
        currentStandard: participant.currentStandard,
        stream: participant.stream,
      },
      events,
    };
  } catch (error: any) {
    console.error('Error looking up participant for booth visits:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while verifying your details. Please try again.',
    };
  }
}

/**
 * Confirm and save chosen university booth visits for a participant
 */
export async function saveBoothVisits({
  participantId,
  eventId,
  universityIds,
}: {
  participantId: string;
  eventId: string;
  universityIds: string[];
}) {
  try {
    if (!participantId || !eventId) {
      return { success: false, error: 'Participant and Event identifiers are required.' };
    }

    if (!Array.isArray(universityIds) || universityIds.length === 0) {
      return { success: false, error: 'Please select at least one university booth to confirm your visit.' };
    }

    // Verify participant exists
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return { success: false, error: 'Participant record not found.' };
    }

    // Update in transaction: replace booth visits for this participant and event
    await prisma.$transaction(async (tx) => {
      // 1. Delete existing booth visits for this participant & event
      await tx.boothVisit.deleteMany({
        where: {
          participantId,
          eventId,
        },
      });

      // 2. Create new booth visits with status PRESENT
      await tx.boothVisit.createMany({
        data: universityIds.map((uniId) => ({
          participantId,
          eventId,
          universityId: uniId,
          status: 'PRESENT',
          visitedAt: new Date(),
        })),
      });

      // 3. Mark event registration as CHECKED_IN if currently CONFIRMED
      await tx.eventRegistration.updateMany({
        where: {
          participantId,
          eventId,
          status: 'CONFIRMED',
        },
        data: {
          status: 'CHECKED_IN',
        },
      });
    });

    // Fetch the updated booth visits to return to the UI
    const updatedVisits = await prisma.boothVisit.findMany({
      where: {
        participantId,
        eventId,
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            city: true,
            logoUrl: true,
          },
        },
      },
      orderBy: {
        university: {
          name: 'asc',
        },
      },
    });

    // Revalidate paths that display booth visits
    revalidatePath('/admin/reports/recommendations');
    revalidatePath('/booths');
    revalidatePath(`/events`);

    return {
      success: true,
      boothVisits: updatedVisits.map((v) => ({
        id: v.id,
        universityId: v.universityId,
        universityName: v.university.name,
        universityCity: v.university.city || 'India',
        universityLogo: v.university.logoUrl,
        visitedAt: v.visitedAt,
      })),
    };
  } catch (error: any) {
    console.error('Error saving booth visits:', error);
    return {
      success: false,
      error: 'Failed to record university booth visits. Please try again.',
    };
  }
}
