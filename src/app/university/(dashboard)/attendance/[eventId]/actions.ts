'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function toggleBoothVisitAction(eventId: string, participantId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.universityId) {
      return { error: "Unauthorized." };
    }
    
    const universityId = session.user.universityId;

    // Check if visit exists
    const existingVisit = await prisma.boothVisit.findUnique({
      where: {
        eventId_universityId_participantId: {
          eventId,
          universityId,
          participantId
        }
      }
    });

    if (existingVisit) {
      // Toggle to absent (delete)
      await prisma.boothVisit.delete({
        where: { id: existingVisit.id }
      });
    } else {
      // Mark present (create)
      await prisma.boothVisit.create({
        data: {
          eventId,
          universityId,
          participantId,
          status: 'PRESENT'
        }
      });
    }

    revalidatePath(`/university/attendance/${eventId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Toggle Booth Visit Error:", error);
    return { error: error.message || "Failed to update attendance." };
  }
}
