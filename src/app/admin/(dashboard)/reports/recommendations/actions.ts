'use server';

import prisma from '@/lib/prisma';

export async function matchCoursesToProfile(participant: any) {
  const result = participant?.assessmentResult;
  if (!result) return [];

  const { scoreD = 0, scoreI = 0, scoreS = 0, scoreC = 0, primaryTrait = 'General' } = result;

  // Flatten all courses from visited booths
  const visitedCourses: any[] = [];
  (participant.boothVisits || []).forEach((visit: any) => {
    if (visit.status === 'PRESENT' || !visit.status) {
      const uni = visit.university;
      (uni?.courses || []).forEach((course: any) => {
        visitedCourses.push({
          ...course,
          universityName: uni.name,
          universityLogo: uni.logoUrl,
          universityCity: uni.city,
        });
      });
    }
  });

  if (visitedCourses.length === 0) return [];

  const trait = (primaryTrait || '').toLowerCase();

  const scored = visitedCourses.map((course) => {
    const cat = (course.category || '').toLowerCase();
    const name = (course.name || '').toLowerCase();
    let score = 55;
    let matchReason = '';

    if (trait === 'influence') {
      if (cat.includes('design') || name.includes('design') || name.includes('media') || name.includes('film')) {
        score += 40;
        matchReason = `Exceptional fit for high Influence (${Math.round(scoreI)}%). Expressive, creative, and communicative strengths align seamlessly with design thinking, media, and creative direction.`;
      } else if (cat.includes('management') || cat.includes('business') || name.includes('bba') || name.includes('marketing')) {
        score += 34;
        matchReason = `Strong match for your collaborative and communicative strengths. Roles in business and marketing leverage natural persuasive flair and team synergy.`;
      } else if (cat.includes('law')) {
        score += 26;
        matchReason = `Good alignment with verbal communication, persuasion, and public advocacy strengths.`;
      } else {
        score += 15;
        matchReason = `Multidisciplinary program benefiting from strong interpersonal communication and collaborative aptitude.`;
      }
    } else if (trait === 'dominance') {
      if (cat.includes('engineering') || name.includes('robotics') || name.includes('computer')) {
        score += 41;
        matchReason = `Outstanding fit for high Dominance (${Math.round(scoreD)}%). Decisive problem solving and high-impact engineering match a results-driven, goal-oriented mindset.`;
      } else if (cat.includes('management') || name.includes('mba') || name.includes('international')) {
        score += 36;
        matchReason = `Strong executive fit. Drive for leadership, strategy, and measurable outcomes aligns directly with modern management disciplines.`;
      } else if (cat.includes('law')) {
        score += 30;
        matchReason = `Excellent match for assertive argumentation, strategic debate, and high-stakes advocacy.`;
      } else {
        score += 15;
        matchReason = `Action-oriented program complementing fast execution and decisive leadership capabilities.`;
      }
    } else if (trait === 'conscientiousness') {
      if (name.includes('data') || name.includes('cyber') || name.includes('cloud') || name.includes('ai') || name.includes('analytics')) {
        score += 43;
        matchReason = `Top-tier fit for high Conscientiousness (${Math.round(scoreC)}%). High precision, algorithmic rigor, and systematic investigation thrive in advanced data and cloud domains.`;
      } else if (cat.includes('computer') || cat.includes('engineering')) {
        score += 36;
        matchReason = `High-affinity program where structured logic, methodical problem solving, and architecture design are fundamental.`;
      } else if (cat.includes('law') || cat.includes('science')) {
        score += 28;
        matchReason = `Strong alignment with evidence-based reasoning, regulatory standards, and thorough analytical research.`;
      } else {
        score += 15;
        matchReason = `Methodical discipline matching structured thinking and quality-focused execution.`;
      }
    } else {
      // Steadiness
      if (cat.includes('science') || name.includes('biotech') || name.includes('pharm') || name.includes('psychology')) {
        score += 40;
        matchReason = `Exceptional fit for high Steadiness (${Math.round(scoreS)}%). Patient research, methodical inquiry, and empathetic orientation excel in life sciences and healthcare.`;
      } else if (cat.includes('engineering') || cat.includes('architecture')) {
        score += 32;
        matchReason = `Reliable track where steady project progression, teamwork, and sustainable execution produce dependable outcomes.`;
      } else {
        score += 18;
        matchReason = `Collaborative, supportive professional track aligning with steady execution and reliable teamwork.`;
      }
    }

    const stream = (participant.stream || '').toLowerCase();
    if (stream.includes('computer') && (cat.includes('engineering') || cat.includes('computer'))) {
      score += 4;
    } else if (stream.includes('science') && (cat.includes('science') || cat.includes('engineering'))) {
      score += 4;
    }

    const matchPercent = Math.min(98, Math.max(74, score));

    return {
      courseId: course.id,
      courseName: course.name,
      universityName: course.universityName,
      universityCity: course.universityCity,
      category: course.category,
      level: course.level,
      marginType: course.marginType,
      marginValue: course.marginValue,
      matchPercent,
      matchReason,
    };
  });

  scored.sort((a, b) => b.matchPercent - a.matchPercent);

  const uniqueRecommendations: any[] = [];
  const seenNames = new Set<string>();

  for (const c of scored) {
    if (!seenNames.has(c.courseName)) {
      seenNames.add(c.courseName);
      uniqueRecommendations.push(c);
      if (uniqueRecommendations.length >= 4) break;
    }
  }

  return uniqueRecommendations;
}

export async function generateAiCourseMapping(participantId: string) {
  try {
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: {
        assessmentResult: true,
        boothVisits: {
          include: {
            university: {
              include: {
                courses: true,
              },
            },
          },
        },
      },
    });

    if (!participant || !participant.assessmentResult) {
      return { error: 'Participant or Assessment Result not found.' };
    }

    if (!participant.boothVisits || participant.boothVisits.length === 0) {
      return { error: 'Student has not selected any preferred colleges.' };
    }

    // Brief animation delay for interactive feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    const recommendedCourses = await matchCoursesToProfile(participant);

    if (recommendedCourses.length === 0) {
      return { error: 'No matching courses found in the preferred colleges selected.' };
    }

    return {
      success: true,
      profileType: participant.assessmentResult.profileType,
      primaryTrait: participant.assessmentResult.primaryTrait,
      recommendations: recommendedCourses,
    };
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return { error: error.message || 'Failed to generate AI recommendations.' };
  }
}
