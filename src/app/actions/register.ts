"use server";

import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const registrationSchema = z.object({
  eventId: z.string(),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  organizationName: z.string().min(2, "Organization name is required"),
  organizationType: z.string().min(2, "Organization type is required"),
  city: z.string().min(2, "City is required"),
});

export async function registerForEvent(formData: z.infer<typeof registrationSchema>) {
  try {
    const validatedData = registrationSchema.parse(formData);

    // 1. Find or create organization
    let organization = await prisma.organization.findFirst({
      where: { name: validatedData.organizationName }
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: validatedData.organizationName,
          type: validatedData.organizationType,
          city: validatedData.city,
        }
      });
    }

    // 2. Find or create participant
    let participant = await prisma.participant.findFirst({
      where: { email: validatedData.email }
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          jobTitle: validatedData.jobTitle,
          organizationId: organization.id,
        }
      });
    } else {
      // Update participant info just in case they changed jobs
      participant = await prisma.participant.update({
        where: { id: participant.id },
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          phone: validatedData.phone,
          jobTitle: validatedData.jobTitle,
          organizationId: organization.id,
        }
      });
    }

    // 3. Check if already registered for this event
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_participantId: {
          eventId: validatedData.eventId,
          participantId: participant.id
        }
      }
    });

    if (existingRegistration) {
      return { success: false, error: "You are already registered for this event." };
    }

    // 4. Create Registration
    const qrCodeValue = uuidv4(); // Generate unique ticket ID for QR
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: validatedData.eventId,
        participantId: participant.id,
        status: "CONFIRMED", // Auto-confirm as per instructions
        qrCodeValue: qrCodeValue,
      }
    });

    revalidatePath(`/events/[slug]`, 'page');
    revalidatePath(`/events/[slug]/register`, 'page');

    return { 
      success: true, 
      registrationId: registration.id,
      ticketCode: qrCodeValue
    };

  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed. Please check your inputs." };
    }
    return { success: false, error: "An unexpected error occurred during registration." };
  }
}
