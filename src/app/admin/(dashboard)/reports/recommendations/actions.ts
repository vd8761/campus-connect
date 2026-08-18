'use server';

import prisma from '@/lib/prisma';

export async function generateAiCourseMapping(participantId: string) {
  try {
    // 1. Fetch Participant and their Assessment Result
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: {
        assessmentResult: true,
        boothVisits: {
          include: {
            university: {
              include: {
                courses: true
              }
            }
          }
        }
      }
    });

    if (!participant || !participant.assessmentResult) {
      return { error: "Participant or Assessment Result not found." };
    }

    if (!participant.boothVisits || participant.boothVisits.length === 0) {
      return { error: "Student has not visited any university booths." };
    }

    // --- CLAUDE AI INTEGRATION PLACEHOLDER ---
    // In production, we would send the participant.assessmentResult and all visited university courses to Claude API here.
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock Response generated based on their D,I,S,C scores and available courses
    const primaryTrait = participant.assessmentResult.primaryTrait;
    
    // Flatten all visited courses
    let allCourses: any[] = [];
    participant.boothVisits.forEach(visit => {
      if (visit.status === 'PRESENT') {
        const uni = visit.university;
        uni.courses.forEach(c => {
          allCourses.push({
            ...c,
            universityName: uni.name
          });
        });
      }
    });

    // Mock matching logic: 
    // Just select 2-3 random courses from the ones they visited to simulate an AI decision
    const recommendedCourses = allCourses.slice(0, 3).map(course => ({
      courseId: course.id,
      courseName: course.name,
      universityName: course.universityName,
      category: course.category,
      level: course.level,
      marginType: course.marginType,
      marginValue: course.marginValue,
      matchReason: `This ${course.category} program strongly aligns with the student's high ${primaryTrait} trait, indicating they will thrive in this environment.`
    }));

    return { 
      success: true, 
      profileType: participant.assessmentResult.profileType,
      primaryTrait: participant.assessmentResult.primaryTrait,
      recommendations: recommendedCourses
    };

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { error: error.message || "Failed to generate AI recommendations." };
  }
}
