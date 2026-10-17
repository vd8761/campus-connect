"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sendEnquiryNotificationEmail, sendEnquiryAcknowledgementEmail } from "@/lib/email";
import { verifyTurnstileToken } from "@/lib/turnstile";

const universityEnquirySchema = z.object({
  universityName: z.string().min(2, "University name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  designation: z.string().min(2, "Designation is required"),
  officialEmail: z.string().email("Valid official email is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  website: z.string().url("Valid website URL is required").optional().or(z.literal("")),
  preferredLocations: z.string().min(2, "Preferred locations are required"),
  partnershipInterests: z.string().min(3, "Partnership interests are required"),
  referralSource: z.string().optional(),
  turnstileToken: z.string().min(1, "Please complete the human verification security check"),
});

const schoolHostingSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  location: z.string().min(2, "School location (City, State) is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  designation: z.string().min(2, "Designation is required"),
  officialEmail: z.string().email("Valid official email is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  expectedStudentAudience: z.string().min(1, "Expected student audience is required"),
  preferredDates: z.string().min(2, "Preferred dates are required"),
  notes: z.string().optional(),
  referralSource: z.string().optional(),
  turnstileToken: z.string().min(1, "Please complete the human verification security check"),
});

const contactUsSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  turnstileToken: z.string().min(1, "Please complete the human verification security check"),
});

export async function submitUniversityPartnershipEnquiry(rawData: unknown) {
  try {
    const data = universityEnquirySchema.parse(rawData);

    // Verify Cloudflare Turnstile human verification
    const turnstileCheck = await verifyTurnstileToken(data.turnstileToken);
    if (!turnstileCheck.success) {
      return { 
        success: false, 
        error: turnstileCheck.error || "Human verification failed. Please try again." 
      };
    }

    const enquiry = await prisma.partnerEnquiry.create({
      data: {
        contactName: data.contactPerson,
        organizationName: data.universityName,
        organizationType: "University",
        designation: data.designation,
        mobile: data.phoneNumber,
        email: data.officialEmail,
        website: data.website || null,
        city: data.preferredLocations,
        partnershipCategory: "UNIVERSITY_PARTNER",
        message: `Preferred Locations: ${data.preferredLocations}\nInterests: ${data.partnershipInterests}\nReferral: ${data.referralSource || "Direct Website"}`,
        status: "PENDING",
      },
    });

    console.log(`[Analytics] University partnership enquiry submitted: ${enquiry.id} (${data.universityName})`);

    // 1. Dispatch internal notification email to administrator / team inbox
    sendEnquiryNotificationEmail({
      category: 'University Partnership',
      subjectTitle: `University Partnership Inquiry: ${data.universityName}`,
      senderName: data.contactPerson,
      senderEmail: data.officialEmail,
      senderPhone: data.phoneNumber,
      organizationName: data.universityName,
      designation: data.designation,
      city: data.preferredLocations,
      details: [
        { label: 'University Name', value: data.universityName },
        { label: 'Contact Person', value: data.contactPerson },
        { label: 'Designation', value: data.designation },
        { label: 'Official Email', value: data.officialEmail },
        { label: 'Phone / WhatsApp', value: data.phoneNumber },
        { label: 'Website', value: data.website || 'N/A' },
        { label: 'Preferred Locations', value: data.preferredLocations },
        { label: 'Partnership Interests', value: data.partnershipInterests },
        { label: 'Referral Source', value: data.referralSource || 'Direct Website' },
        { label: 'Database Reference ID', value: enquiry.id },
      ],
      notes: `Preferred Locations: ${data.preferredLocations}\nInterests: ${data.partnershipInterests}`,
    }).catch(err => console.error('[Email Notification Error]', err));

    // 2. Dispatch personalized thank you acknowledgement email to the user
    sendEnquiryAcknowledgementEmail({
      category: 'University Partnership',
      recipientName: data.contactPerson,
      recipientEmail: data.officialEmail,
      organizationName: data.universityName,
      enquiryId: enquiry.id,
      details: [
        { label: 'University / Institution', value: data.universityName },
        { label: 'Primary Contact Person', value: data.contactPerson },
        { label: 'Official Designation', value: data.designation },
        { label: 'Official Email ID', value: data.officialEmail },
        { label: 'Phone / WhatsApp', value: data.phoneNumber },
        { label: 'Preferred Conclave Locations', value: data.preferredLocations },
        { label: 'Partnership Interests', value: data.partnershipInterests },
      ],
    }).catch(err => console.error('[User Thank You Email Error]', err));

    revalidatePath("/partnerships");
    revalidatePath("/admin/partners");

    return {
      success: true,
      enquiryId: enquiry.id,
      message: "Thank you for partnering with Campus Square! Our university relations team will reach out to you shortly.",
    };
  } catch (error: any) {
    console.error("Error submitting university partnership enquiry:", error);
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const fieldName = issue.path[0];
        if (fieldName && typeof fieldName === 'string') {
          fieldErrors[fieldName] = issue.message;
        }
      }
      return { success: false, error: error.issues[0]?.message || "Invalid input data.", fieldErrors };
    }
    return { success: false, error: "Failed to submit partnership enquiry. Please try again or contact us on WhatsApp at +91 80561 34455." };
  }
}

export async function submitSchoolHostingEnquiry(rawData: unknown) {
  try {
    const data = schoolHostingSchema.parse(rawData);

    // Verify Cloudflare Turnstile human verification
    const turnstileCheck = await verifyTurnstileToken(data.turnstileToken);
    if (!turnstileCheck.success) {
      return { 
        success: false, 
        error: turnstileCheck.error || "Human verification failed. Please try again." 
      };
    }

    const enquiry = await prisma.partnerEnquiry.create({
      data: {
        contactName: data.contactPerson,
        organizationName: data.schoolName,
        organizationType: "School",
        designation: data.designation,
        mobile: data.phoneNumber,
        email: data.officialEmail,
        city: data.location,
        partnershipCategory: "HOST_SCHOOL",
        message: `Expected Audience: ${data.expectedStudentAudience}\nPreferred Dates: ${data.preferredDates}\nNotes: ${data.notes || "None"}\nReferral: ${data.referralSource || "Direct Website"}`,
        status: "PENDING",
      },
    });

    console.log(`[Analytics] School hosting enquiry submitted: ${enquiry.id} (${data.schoolName})`);

    // 1. Dispatch internal notification email to administrator / team inbox
    sendEnquiryNotificationEmail({
      category: 'Host School Proposal',
      subjectTitle: `School Hosting Proposal: ${data.schoolName}`,
      senderName: data.contactPerson,
      senderEmail: data.officialEmail,
      senderPhone: data.phoneNumber,
      organizationName: data.schoolName,
      designation: data.designation,
      city: data.location,
      details: [
        { label: 'School Name', value: data.schoolName },
        { label: 'School Location', value: data.location },
        { label: 'Contact Person', value: data.contactPerson },
        { label: 'Designation', value: data.designation },
        { label: 'Official Email', value: data.officialEmail },
        { label: 'Phone / WhatsApp', value: data.phoneNumber },
        { label: 'Expected Student Audience', value: data.expectedStudentAudience },
        { label: 'Preferred Dates', value: data.preferredDates },
        { label: 'Referral Source', value: data.referralSource || 'Direct Website' },
        { label: 'Database Reference ID', value: enquiry.id },
      ],
      notes: data.notes || undefined,
    }).catch(err => console.error('[Email Notification Error]', err));

    // 2. Dispatch personalized thank you acknowledgement email to the user
    sendEnquiryAcknowledgementEmail({
      category: 'Host School Proposal',
      recipientName: data.contactPerson,
      recipientEmail: data.officialEmail,
      organizationName: data.schoolName,
      enquiryId: enquiry.id,
      details: [
        { label: 'School Name', value: data.schoolName },
        { label: 'Location (City, State)', value: data.location },
        { label: 'Contact Person', value: data.contactPerson },
        { label: 'Official Designation', value: data.designation },
        { label: 'Official Email ID', value: data.officialEmail },
        { label: 'Phone / WhatsApp', value: data.phoneNumber },
        { label: 'Expected Student Audience', value: data.expectedStudentAudience },
        { label: 'Preferred Dates', value: data.preferredDates },
      ],
    }).catch(err => console.error('[User Thank You Email Error]', err));

    revalidatePath("/host");
    revalidatePath("/admin/partners");

    return {
      success: true,
      enquiryId: enquiry.id,
      message: "Thank you for your interest in hosting Campus Square! Our school partnerships team will connect with your leadership team promptly.",
    };
  } catch (error: any) {
    console.error("Error submitting school hosting enquiry:", error);
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const fieldName = issue.path[0];
        if (fieldName && typeof fieldName === 'string') {
          fieldErrors[fieldName] = issue.message;
        }
      }
      return { success: false, error: error.issues[0]?.message || "Invalid input data.", fieldErrors };
    }
    return { success: false, error: "Failed to submit hosting enquiry. Please try again or contact us on WhatsApp at +91 80561 34455." };
  }
}

export async function submitContactUsMessage(rawData: unknown) {
  try {
    const data = contactUsSchema.parse(rawData);

    // Verify Cloudflare Turnstile human verification
    const turnstileCheck = await verifyTurnstileToken(data.turnstileToken);
    if (!turnstileCheck.success) {
      return { 
        success: false, 
        error: turnstileCheck.error || "Human verification failed. Please try again." 
      };
    }

    const fullName = `${data.firstName} ${data.lastName}`.trim();

    const enquiry = await prisma.partnerEnquiry.create({
      data: {
        contactName: fullName,
        organizationName: "Direct Website Contact",
        organizationType: "General",
        mobile: "N/A",
        email: data.email,
        partnershipCategory: "CONTACT_US",
        message: `Subject: ${data.subject}\n\nMessage:\n${data.message}`,
        status: "PENDING",
      },
    });

    console.log(`[Analytics] Contact Us message received: ${enquiry.id} from ${fullName}`);

    // 1. Dispatch internal notification email to administrator / team inbox
    sendEnquiryNotificationEmail({
      category: 'General Contact Message',
      subjectTitle: `Contact Form Message: ${data.subject}`,
      senderName: fullName,
      senderEmail: data.email,
      details: [
        { label: 'Full Name', value: fullName },
        { label: 'Email Address', value: data.email },
        { label: 'Subject', value: data.subject },
        { label: 'Database Reference ID', value: enquiry.id },
      ],
      notes: data.message,
    }).catch(err => console.error('[Email Notification Error]', err));

    // 2. Dispatch personalized thank you acknowledgement email to the user
    sendEnquiryAcknowledgementEmail({
      category: 'General Contact Message',
      recipientName: fullName,
      recipientEmail: data.email,
      enquiryId: enquiry.id,
      details: [
        { label: 'Full Name', value: fullName },
        { label: 'Email Address', value: data.email },
        { label: 'Subject', value: data.subject },
        { label: 'Your Message', value: data.message },
      ],
    }).catch(err => console.error('[User Thank You Email Error]', err));

    revalidatePath("/contact");

    return {
      success: true,
      enquiryId: enquiry.id,
      message: "Thank you for reaching out to Campus Square! We have received your message and will respond promptly.",
    };
  } catch (error: any) {
    console.error("Error submitting contact message:", error);
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const fieldName = issue.path[0];
        if (fieldName && typeof fieldName === 'string') {
          fieldErrors[fieldName] = issue.message;
        }
      }
      return { success: false, error: error.issues[0]?.message || "Invalid input data.", fieldErrors };
    }
    return { success: false, error: "Failed to send your message. Please try again or reach out on WhatsApp at +91 80561 34455." };
  }
}

