"use server";

import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from '@/lib/prisma';
import { verifyTurnstileToken } from '@/lib/turnstile';

const registrationSchema = z.object({
  eventId: z.string(),
  studentName: z.string().min(2, "Student name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  gender: z.string().min(2, "Gender is required"),
  turnstileToken: z.string().min(1, "Human verification is required"),
  
  // Student details
  board: z.string().min(2, "Board is required"),
  schoolLevel: z.string().min(2, "School level is required"),
  stream: z.string().optional(),
  currentStandard: z.string().optional(),

  // School / Org details
  organizationName: z.string().min(2, "School name is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
});

export async function registerForEvent(formData: z.infer<typeof registrationSchema>) {
  try {
    const validatedData = registrationSchema.parse(formData);

    // Verify Turnstile Token
    const turnstileCheck = await verifyTurnstileToken(validatedData.turnstileToken);
    if (!turnstileCheck.success) {
      return { success: false, error: turnstileCheck.error || "Security check failed. Please try again." };
    }

    // 1. Find or create organization (School)
    let organization = await prisma.organization.findFirst({
      where: { name: validatedData.organizationName }
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: validatedData.organizationName,
          orgType: "School",
          city: validatedData.city,
          address: validatedData.address,
        }
      });
    }

    // 2. Find or create participant (Student)
    let participant = await prisma.participant.findFirst({
      where: { email: validatedData.email }
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          fullName: validatedData.studentName,
          email: validatedData.email,
          mobile: validatedData.phone,
          gender: validatedData.gender,
          category: "Student",
          board: validatedData.board,
          schoolLevel: validatedData.schoolLevel,
          stream: validatedData.stream,
          currentStandard: validatedData.currentStandard,
          organizationId: organization.id,
        }
      });
    } else {
      participant = await prisma.participant.update({
        where: { id: participant.id },
        data: {
          fullName: validatedData.studentName,
          mobile: validatedData.phone,
          gender: validatedData.gender,
          board: validatedData.board,
          schoolLevel: validatedData.schoolLevel,
          stream: validatedData.stream,
          currentStandard: validatedData.currentStandard,
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
        registrationId: qrCodeValue,
      }
    });

    const eventDetails = await prisma.event.findUnique({
      where: { id: validatedData.eventId }
    });

    // Send Email
    if (eventDetails) {
      const { sendRegistrationEmail } = await import('@/lib/email');
      await sendRegistrationEmail({
        to: validatedData.email,
        name: validatedData.studentName,
        ticketCode: qrCodeValue,
        eventName: eventDetails.title,
      });
    }

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
