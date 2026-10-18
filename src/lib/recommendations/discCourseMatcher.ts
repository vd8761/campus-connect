import prisma from '@/lib/prisma';
import { ORIGINBI_16_TRAITS } from '@/lib/discTraits';

export interface MatchedUniversityCourse {
  rank: number;
  universityId: string;
  universityName: string;
  universityCity: string;
  universityLogo?: string | null;
  boothNumber?: string | null;
  isVisited?: boolean;
  courseId: string;
  courseName: string;
  category: string;
  level: string;
  marginType: string;
  marginValue: number;
  matchScore: number;
  fitLevel: 'Optimal Fit' | 'Strong Fit' | 'Recommended Fit';
  fitReason: string;
}

export interface DiscProfileFitmentReport {
  participantId: string;
  fullName: string;
  mobile: string;
  email: string;
  stream: string;
  eventId: string;
  eventTitle: string;
  eventCity: string;
  totalUniversitiesCount: number;
  visitedCount: number;
  examRefNo: string;
  completedAt: string;
  scores: {
    d: number;
    i: number;
    s: number;
    c: number;
  };
  primaryTrait: string;
  secondaryTrait: string;
  traitCode: string;
  archetypeName: string;
  archetypeColor: string;
  behavioralOrientation: string;
  executiveSummary: string;
  strengths: string[];
  careerTrajectories: string[];
  matchedUniversities: MatchedUniversityCourse[];
}

/**
 * OriginBI Classical 16-Trait Permutations & Combinations Matrix
 * Detailed behavioral affinity rules, category weights, and rationale generators
 * for all 16 DISC styles: D, DI, DS, DC, I, ID, IS, IC, S, SD, SI, SC, C, CD, CI, CS.
 */
interface TraitCombinationRule {
  primaryCategories: string[];
  secondaryCategories: string[];
  tertiaryCategories: string[];
  primaryBoost: number;
  secondaryBoost: number;
  tertiaryBoost: number;
  rationaleGenerator: (courseName: string, category: string, scores: { d: number; i: number; s: number; c: number }) => string;
  defaultSummary: (name: string, stream: string) => string;
  strengths: string[];
  careerTrajectories: string[];
}

const ORIGINBI_16_COMBINATION_RULES: Record<string, TraitCombinationRule> = {
  // 1. D - Bold Driver
  D: {
    primaryCategories: ['engineering', 'robotics', 'aerospace', 'computer science', 'artificial intelligence'],
    secondaryCategories: ['management', 'entrepreneurship', 'business administration', 'strategy'],
    tertiaryCategories: ['law', 'corporate litigation', 'applied sciences'],
    primaryBoost: 38,
    secondaryBoost: 30,
    tertiaryBoost: 22,
    rationaleGenerator: (course, cat, s) =>
      `Optimal match for high Dominance (${s.d}%). Driven by measurable outcomes, swift risk-taking, and high-impact engineering leadership in ${course}.`,
    defaultSummary: (name) =>
      `${name} exhibits a Bold Driver (D) profile. Decisive problem solving, goal-oriented autonomy, and high milestone velocity naturally succeed in rigorous technological and competitive executive disciplines.`,
    strengths: [
      'Decisive risk-taking and rapid milestone execution',
      'High autonomy, personal accountability, and competitive focus',
      'Comfortable spearheading high-stakes innovation and strategic initiatives',
    ],
    careerTrajectories: [
      'Advanced Robotics, AI & Autonomous Cyber-Physical Engineering',
      'Venture Entrepreneurship & Corporate Strategy',
      'Strategic Technology Management & High-Impact Operations',
    ],
  },

  // 2. DI - Charismatic Leader
  DI: {
    primaryCategories: ['management', 'entrepreneurship', 'marketing', 'media leadership', 'international business'],
    secondaryCategories: ['design', 'product engineering', 'computer science', 'communication'],
    tertiaryCategories: ['law', 'public administration', 'liberal arts'],
    primaryBoost: 38,
    secondaryBoost: 31,
    tertiaryBoost: 23,
    rationaleGenerator: (course, cat, s) =>
      `Compelling fit for Charismatic Leader blend (D: ${s.d}%, I: ${s.i}%). Persuasive storytelling and ambitious goal-orientation energize teams in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Charismatic Leader (DI) style. Unites visionary ambition with contagious enthusiasm, thriving where strategic leadership, venture creation, and collaborative advocacy intersect.`,
    strengths: [
      'Dynamic vision-setting paired with persuasive stakeholder mobilization',
      'High comfort initiating change, pitching concepts, and driving team momentum',
      'Cross-disciplinary adaptability across commercial and technological tracks',
    ],
    careerTrajectories: [
      'Entrepreneurship & Venture Commercialization',
      'Global Brand Management & Strategic Tech Marketing',
      'Executive Leadership in Emerging Tech & Digital Media',
    ],
  },

  // 3. DS - Strategic Stabilizer
  DS: {
    primaryCategories: ['civil engineering', 'industrial engineering', 'operations management', 'supply chain'],
    secondaryCategories: ['healthcare management', 'systems engineering', 'environmental engineering'],
    tertiaryCategories: ['business administration', 'applied sciences', 'information technology'],
    primaryBoost: 37,
    secondaryBoost: 30,
    tertiaryBoost: 22,
    rationaleGenerator: (course, cat, s) =>
      `Strong match for Strategic Stabilizer blend (D: ${s.d}%, S: ${s.s}%). Blends high-target focus with methodical, sustainable process execution in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Strategic Stabilizer (DS) style. Balances goal-oriented drive with patient, structured follow-through, ensuring ambitious objectives are grounded in dependable operational reality.`,
    strengths: [
      'Converts high-level goals into realistic, well-paced operational milestones',
      'Balances decisive momentum with team stability and workplace cohesion',
      'Resilient problem solving under shifting organizational demands',
    ],
    careerTrajectories: [
      'Industrial & Operations Management / Supply Chain Architecture',
      'Civil, Structural & Sustainable Infrastructure Engineering',
      'Health Systems Administration & Healthcare Operations',
    ],
  },

  // 4. DC - Decisive Analyst
  DC: {
    primaryCategories: ['quantitative finance', 'fintech', 'cyber security', 'artificial intelligence', 'systems engineering'],
    secondaryCategories: ['corporate law', 'patent law', 'data science', 'computer applications'],
    tertiaryCategories: ['mechanical engineering', 'economics', 'business analytics'],
    primaryBoost: 39,
    secondaryBoost: 32,
    tertiaryBoost: 24,
    rationaleGenerator: (course, cat, s) =>
      `Top-tier alignment with Decisive Analyst blend (D: ${s.d}%, C: ${s.c}%). Demands analytical rigor, objective proof, and high execution speed in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Decisive Analyst (DC) style. Slices through ambiguity with sharp logical reasoning and assertive execution, thriving in complex technical, financial, and legal architectures.`,
    strengths: [
      'Sharp evidence-based deduction and rapid architectural decision-making',
      'Relentless quality standards coupled with high delivery pace',
      'Comfortable dissecting complex data models and high-stakes regulatory frameworks',
    ],
    careerTrajectories: [
      'Fintech Engineering, Algorithmic Trading & Quantitative Analytics',
      'Cyber-Physical Security & Mission-Critical Software Systems',
      'Corporate & Intellectual Property Technology Law',
    ],
  },

  // 5. I - Inspiring Motivator
  I: {
    primaryCategories: ['design', 'visual communication', 'film', 'media', 'animation', 'creative arts'],
    secondaryCategories: ['marketing', 'public relations', 'journalism', 'business administration'],
    tertiaryCategories: ['liberal arts', 'humanities', 'psychology'],
    primaryBoost: 38,
    secondaryBoost: 30,
    tertiaryBoost: 22,
    rationaleGenerator: (course, cat, s) =>
      `Ideal alignment with high Influence (${s.i}%). Expressive flair, creative visual thinking, and interpersonal warmth excel in ${course}.`,
    defaultSummary: (name) =>
      `${name} exhibits an Inspiring Motivator (I) style. Natural expressive fluency, infectious optimism, and relational empathy create exceptional synergy in creative storytelling, brand direction, and collaborative innovation.`,
    strengths: [
      'Empathetic interpersonal communication, rapport-building, and public presentation',
      'Creative ideation, aesthetic sensitivity, and out-of-the-box conceptualization',
      'Energizes multidisciplinary teams and wins people over with ease',
    ],
    careerTrajectories: [
      'Visual Communication, Media Direction & Digital Storytelling',
      'Creative Advertising, Public Relations & Brand Strategy',
      'Interactive Media, Entertainment Arts & UX Concept Design',
    ],
  },

  // 6. ID - Energetic Visionary
  ID: {
    primaryCategories: ['design', 'industrial design', 'user experience', 'media', 'product innovation'],
    secondaryCategories: ['marketing', 'entrepreneurship', 'business administration', 'computer science'],
    tertiaryCategories: ['liberal arts', 'international relations', 'communication'],
    primaryBoost: 39,
    secondaryBoost: 32,
    tertiaryBoost: 24,
    rationaleGenerator: (course, cat, s) =>
      `Exceptional fit for Energetic Visionary blend (I: ${s.i}%, D: ${s.d}%). Combines imaginative design thinking with proactive initiative in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates an Energetic Visionary (ID) style. Integrates bold conceptual creativity with action-oriented execution, pioneering visionary ideas in product design, brand direction, and technological innovation.`,
    strengths: [
      'Pioneering conceptual design paired with rapid prototype testing',
      'Persuasive narrative architecture and dynamic cross-functional leadership',
      'High curiosity and comfort exploring uncharted interdisciplinary domains',
    ],
    careerTrajectories: [
      'Industrial & Transportation Design / UX & Interactive Product Innovation',
      'Creative Direction, Media Strategy & Brand Architecture',
      'Tech Innovation Commercialization & Venture Design',
    ],
  },

  // 7. IS - Supportive Energizer
  IS: {
    primaryCategories: ['psychology', 'human resource management', 'hospitality', 'communication'],
    secondaryCategories: ['allied health', 'education', 'social sciences', 'business administration'],
    tertiaryCategories: ['design', 'humanities', 'liberal arts'],
    primaryBoost: 37,
    secondaryBoost: 30,
    tertiaryBoost: 22,
    rationaleGenerator: (course, cat, s) =>
      `Natural match for Supportive Energizer blend (I: ${s.i}%, S: ${s.s}%). Warm relational empathy and dependable teamwork foster collaborative growth in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Supportive Energizer (IS) style. Fosters psychological safety, positive team spirit, and empathetic communication, thriving in people-centric human sciences, hospitality, and healthcare counseling.`,
    strengths: [
      'High emotional intelligence, active listening, and consensus-building',
      'Fosters team morale, trust, and productive group dynamics',
      'Gentle persuasion backed by sincere service-oriented commitment',
    ],
    careerTrajectories: [
      'Organizational Psychology & Human Capital Leadership',
      'Hospitality, Experience Management & Corporate Relations',
      'Counseling Psychology, Student Affairs & Community Wellbeing',
    ],
  },

  // 8. IC - Creative Thinker
  IC: {
    primaryCategories: ['architecture', 'planning', 'interior design', 'digital media analytics', 'behavioral economics'],
    secondaryCategories: ['journalism', 'communication', 'user experience', 'data science'],
    tertiaryCategories: ['management', 'liberal arts', 'applied sciences'],
    primaryBoost: 38,
    secondaryBoost: 31,
    tertiaryBoost: 23,
    rationaleGenerator: (course, cat, s) =>
      `Distinctive fit for Creative Thinker blend (I: ${s.i}%, C: ${s.c}%). Pairs imaginative aesthetic flair with structured research and precision in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Creative Thinker (IC) style. Synthesizes aesthetic elegance with analytical rigor, excelling where imaginative storytelling is reinforced by solid technical architecture and evidence.`,
    strengths: [
      'Harmonizes creative intuition with systematic research and documentation',
      'High aesthetic discernment supported by objective quality checks',
      'Articulates complex technical paradigms through engaging visual narratives',
    ],
    careerTrajectories: [
      'Architecture, Urban Planning & Sustainable Spatial Design',
      'Information Design, UX Analytics & Technical Communication',
      'Behavioral Economics, Market Intelligence & Consumer Insights',
    ],
  },

  // 9. S - Steadfast Anchor
  S: {
    primaryCategories: ['allied health', 'nursing', 'pharmacy', 'biotechnology', 'physiotherapy'],
    secondaryCategories: ['environmental science', 'education', 'agriculture', 'psychology'],
    tertiaryCategories: ['architecture', 'civil engineering', 'applied sciences'],
    primaryBoost: 38,
    secondaryBoost: 30,
    tertiaryBoost: 22,
    rationaleGenerator: (course, cat, s) =>
      `Natural resonance with high Steadiness (${s.s}%). Patient dedication, dependable empathy, and methodical care thrive in ${course}.`,
    defaultSummary: (name) =>
      `${name} exhibits a Steadfast Anchor (S) style. Calm consistency, compassionate service, and enduring patience provide exceptional grounding in life sciences, healthcare, and sustainable environmental disciplines.`,
    strengths: [
      'Dependable, methodical follow-through on complex long-term protocols',
      'Empathetic patient care, active listening, and emotional stability under pressure',
      'Fosters long-term institutional loyalty and dependable team collaboration',
    ],
    careerTrajectories: [
      'Allied Health Sciences, Clinical Diagnostics & Patient Care',
      'Pharmaceutical Sciences, Biotechnology & Healthcare Therapy',
      'Environmental Sustainability, Agro-Biotech & Community Health',
    ],
  },

  // 10. SD - Reliable Executor
  SD: {
    primaryCategories: ['civil engineering', 'logistics', 'construction technology', 'hospital administration'],
    secondaryCategories: ['mechanical engineering', 'operations', 'environmental engineering'],
    tertiaryCategories: ['applied sciences', 'information technology', 'business administration'],
    primaryBoost: 38,
    secondaryBoost: 31,
    tertiaryBoost: 23,
    rationaleGenerator: (course, cat, s) =>
      `High alignment with Reliable Executor blend (S: ${s.s}%, D: ${s.d}%). Converts strategic plans into orderly, dependable execution in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Reliable Executor (SD) style. Combines steadfast resilience with goal-oriented determination, executing complex operational projects reliably from conception to delivery.`,
    strengths: [
      'Tenacious persistence through operational hurdles and regulatory guidelines',
      'Systematic workflow scheduling that delivers consistent milestone outcomes',
      'Dependable leadership that commands respect through quiet reliability',
    ],
    careerTrajectories: [
      'Civil, Structural & Urban Infrastructure Engineering',
      'Logistics, Supply Chain Engineering & Facility Operations',
      'Hospital & Clinical Services Administration',
    ],
  },

  // 11. SI - Collaborative Optimist
  SI: {
    primaryCategories: ['allied health', 'healthcare administration', 'clinical psychology', 'education'],
    secondaryCategories: ['communication', 'human resources', 'social sciences', 'hospitality'],
    tertiaryCategories: ['biotechnology', 'applied sciences', 'management'],
    primaryBoost: 37,
    secondaryBoost: 30,
    tertiaryBoost: 22,
    rationaleGenerator: (course, cat, s) =>
      `Heartfelt match for Collaborative Optimist blend (S: ${s.s}%, I: ${s.i}%). Fosters morale and team cohesion with patience and empathy in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Collaborative Optimist (SI) style. Blends patient listening with positive encouragement, creating harmonious, high-trust environments in clinical therapy, healthcare education, and public service.`,
    strengths: [
      'Attentive, compassionate communication that calms and reassures others',
      'Builds cohesive, cross-functional consensus with patience and tact',
      'Steadfast dedication to community wellbeing and service excellence',
    ],
    careerTrajectories: [
      'Clinical Psychology, Counseling & Behavioral Health Sciences',
      'Healthcare Management, Patient Advocacy & Hospital Administration',
      'Specialized Education, Community Development & Public Health',
    ],
  },

  // 12. SC - Dependable Specialist
  SC: {
    primaryCategories: ['pharmacy', 'medical lab technology', 'biotechnology research', 'quality assurance'],
    secondaryCategories: ['environmental engineering', 'chemistry', 'forensic sciences'],
    tertiaryCategories: ['computer science', 'civil engineering', 'allied health'],
    primaryBoost: 39,
    secondaryBoost: 32,
    tertiaryBoost: 24,
    rationaleGenerator: (course, cat, s) =>
      `Methodical match for Dependable Specialist blend (S: ${s.s}%, C: ${s.c}%). High procedural fidelity, patient precision, and risk anticipation shine in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Dependable Specialist (SC) style. Pairs meticulous attention to protocol with patient consistency, excelling in rigorous laboratory research, pharmaceutical testing, and quality governance.`,
    strengths: [
      'Unwavering adherence to clinical and laboratory compliance standards',
      'Patient, repeatable analytical testing and comprehensive documentation',
      'Anticipates quality risks and maintains exceptional verification discipline',
    ],
    careerTrajectories: [
      'Pharmaceutical Sciences, Drug Quality Assurance & Pharmacology',
      'Medical Laboratory Technology & Molecular Biotechnology Research',
      'Clinical Trial Auditing, Regulatory Affairs & Biostatistics',
    ],
  },

  // 13. C - Precise Perfectionist
  C: {
    primaryCategories: ['artificial intelligence', 'data science', 'cyber security', 'cloud computing'],
    secondaryCategories: ['computer applications', 'mathematics', 'software engineering', 'accounting'],
    tertiaryCategories: ['forensic sciences', 'applied physics', 'law'],
    primaryBoost: 39,
    secondaryBoost: 31,
    tertiaryBoost: 23,
    rationaleGenerator: (course, cat, s) =>
      `Top-tier match for high Conscientiousness (${s.c}%). Deep analytical concentration, structured logic, and algorithmic precision excel in ${course}.`,
    defaultSummary: (name) =>
      `${name} exhibits a Precise Perfectionist (C) style. High standards of accuracy, systematic logic, and deep analytical inquiry produce authoritative excellence in advanced computational, mathematical, and data domains.`,
    strengths: [
      'Rigorous algorithmic logic and architectural error prevention',
      'Systematic data verification and evidence-based problem formulation',
      'Deep intellectual stamina for complex, multi-layered problem architectures',
    ],
    careerTrajectories: [
      'Artificial Intelligence, Machine Learning & Computational Data Science',
      'Cyber Security, Cryptography & Secure Cloud Infrastructure',
      'Advanced Software Systems Architecture & Formal Verification',
    ],
  },

  // 14. CD - Analytical Leader
  CD: {
    primaryCategories: ['software architecture', 'systems engineering', 'quantitative economics', 'investment banking'],
    secondaryCategories: ['computer science', 'artificial intelligence', 'corporate law', 'fintech'],
    tertiaryCategories: ['management', 'mathematics', 'data science'],
    primaryBoost: 40,
    secondaryBoost: 32,
    tertiaryBoost: 24,
    rationaleGenerator: (course, cat, s) =>
      `Commanding fit for Analytical Leader blend (C: ${s.c}%, D: ${s.d}%). Couples structured logical architecture with measurable delivery milestones in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates an Analytical Leader (CD) style. Devises data-driven strategies and demands objective excellence, excelling in demanding software engineering, quantitative finance, and technological leadership roles.`,
    strengths: [
      'Translates intricate analytical frameworks into scalable execution roadmaps',
      'High objective standards coupled with accountability and milestone ownership',
      'Rapid root-cause diagnosis under complex and ambiguous system constraints',
    ],
    careerTrajectories: [
      'Enterprise Software Architecture & Distributed Cloud Engineering',
      'Quantitative Finance, Risk Architecture & Investment Banking',
      'Technology Strategy, Patent Law & Cyber-Physical Systems Governance',
    ],
  },

  // 15. CI - Logical Innovator
  CI: {
    primaryCategories: ['business analytics', 'tech product management', 'cognitive science', 'computational design'],
    secondaryCategories: ['data science', 'computer science', 'digital marketing analytics', 'economics'],
    tertiaryCategories: ['media', 'design', 'information systems'],
    primaryBoost: 38,
    secondaryBoost: 31,
    tertiaryBoost: 23,
    rationaleGenerator: (course, cat, s) =>
      `Inventive match for Logical Innovator blend (C: ${s.c}%, I: ${s.i}%). Blends systematic reasoning with creative 'what-if' boundary exploration in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Logical Innovator (CI) style. Bridges analytical precision with imaginative exploration, thriving where data-backed deduction meets innovative product design and strategic tech communication.`,
    strengths: [
      'Synthesizes complex data intelligence into persuasive visual insights',
      'Combines rigorous logical validation with creative boundary-pushing ideation',
      'Bridges the communication gap between technical engineers and executive stakeholders',
    ],
    careerTrajectories: [
      'Data Science Storytelling & Tech Product Management',
      'Business Intelligence Architecture & Quantitative Market Research',
      'Computational Design, Algorithmic Media & Human-Computer Interaction',
    ],
  },

  // 16. CS - Structured Supporter
  CS: {
    primaryCategories: ['accounting', 'acca', 'cma', 'finance', 'regulatory compliance'],
    secondaryCategories: ['information systems', 'clinical research', 'corporate auditing', 'computer applications'],
    tertiaryCategories: ['data analytics', 'economics', 'applied sciences'],
    primaryBoost: 39,
    secondaryBoost: 31,
    tertiaryBoost: 23,
    rationaleGenerator: (course, cat, s) =>
      `Exemplary alignment with Structured Supporter blend (C: ${s.c}%, S: ${s.s}%). Meticulous compliance, quality checks, and quiet stability excel in ${course}.`,
    defaultSummary: (name) =>
      `${name} demonstrates a Structured Supporter (CS) style. Provides methodical precision, comprehensive documentation, and calm stability, excelling in global accounting standards, financial governance, and regulatory auditing.`,
    strengths: [
      'Flawless procedural adherence, auditing rigor, and risk mitigation',
      'Patient, structured workflow documentation that protects institutional integrity',
      'High personal ethics, reliability, and precision under detailed compliance codes',
    ],
    careerTrajectories: [
      'Professional Accounting & Global Governance (ACCA / CMA / CA)',
      'Financial Risk Auditing, Taxation & Regulatory Compliance',
      'Clinical Research Auditing, Information Governance & Health Informatics',
    ],
  },
};

/**
 * Universal behavioral course matching engine
 * Dynamically resolves event-specific participating universities or all active fair universities,
 * applies the complete 16-trait permutation and combination matrix + academic stream eligibility,
 * and generates AI-enriched or deterministic behavioral fitment reports.
 */
export async function getDiscCourseMatches(
  participantId: string,
  eventId?: string
): Promise<DiscProfileFitmentReport | null> {
  // 1. Fetch Participant with Assessment Result, Registrations, and Booth Visits
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      assessmentResult: true,
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
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      boothVisits: {
        include: {
          university: true,
        },
      },
    },
  });

  if (!participant || !participant.assessmentResult) {
    return null;
  }

  const result = participant.assessmentResult;
  const scoreD = Math.round(result.scoreD);
  const scoreI = Math.round(result.scoreI);
  const scoreS = Math.round(result.scoreS);
  const scoreC = Math.round(result.scoreC);
  const scoresObj = { d: scoreD, i: scoreI, s: scoreS, c: scoreC };

  // 2. Compute Primary & Secondary Traits and Blended Trait Code
  const traitScores = [
    { trait: 'D', score: scoreD },
    { trait: 'I', score: scoreI },
    { trait: 'S', score: scoreS },
    { trait: 'C', score: scoreC },
  ].sort((a, b) => b.score - a.score);

  const primaryTraitCode = traitScores[0].trait;
  const secondaryTraitCode = traitScores[1].trait;
  const blendedCode = `${primaryTraitCode}${secondaryTraitCode}`;

  // Resolve Trait Meta from ORIGINBI_16_TRAITS
  const traitMeta =
    ORIGINBI_16_TRAITS[blendedCode] ||
    ORIGINBI_16_TRAITS[primaryTraitCode] ||
    ORIGINBI_16_TRAITS['I'];

  // Resolve Permutation & Combination Matching Rule
  const rule =
    ORIGINBI_16_COMBINATION_RULES[blendedCode] ||
    ORIGINBI_16_COMBINATION_RULES[primaryTraitCode] ||
    ORIGINBI_16_COMBINATION_RULES['I'];

  // 3. Resolve the Target Event (Specified eventId -> Participant's registered event -> Most active event)
  let targetEvent: any = null;

  if (eventId) {
    targetEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        universityEvents: {
          include: {
            university: {
              include: {
                courses: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
      },
    });
  }

  if (!targetEvent && participant.registrations.length > 0) {
    targetEvent = participant.registrations[0].event;
  }

  if (!targetEvent) {
    targetEvent = await prisma.event.findFirst({
      orderBy: { startDate: 'desc' },
      include: {
        universityEvents: {
          include: {
            university: {
              include: {
                courses: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
      },
    });
  }

  // 4. Resolve Eligible Universities (Participating in this event edition, or all active universities)
  interface ResolvedUniversityItem {
    id: string;
    name: string;
    city: string;
    logoUrl?: string | null;
    boothNumber?: string | null;
    courses: any[];
  }

  const eligibleUniversities: ResolvedUniversityItem[] = [];

  if (targetEvent?.universityEvents && targetEvent.universityEvents.length > 0) {
    // Universities mapped to this specific event edition
    targetEvent.universityEvents.forEach((ue: any) => {
      if (ue.university && ue.university.courses && ue.university.courses.length > 0) {
        eligibleUniversities.push({
          id: ue.university.id,
          name: ue.university.name,
          city: ue.university.city || 'India',
          logoUrl: ue.university.logoUrl,
          boothNumber: ue.boothNumber,
          courses: ue.university.courses,
        });
      }
    });
  } else {
    // Dynamic Fallback: All active universities with courses in the database
    const allUnis = await prisma.university.findMany({
      include: {
        courses: {
          where: { isActive: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    allUnis.forEach((u) => {
      if (u.courses && u.courses.length > 0) {
        eligibleUniversities.push({
          id: u.id,
          name: u.name,
          city: u.city || 'India',
          logoUrl: u.logoUrl,
          boothNumber: null,
          courses: u.courses,
        });
      }
    });
  }

  // Set of Visited Universities by this candidate
  const visitedUniIds = new Set(participant.boothVisits.map((v) => v.universityId));

  // 5. Evaluate Every University & Find the #1 Best-Fit Course Using the 16-Trait Matrix
  const studentStream = (participant.stream || '').toLowerCase();
  const universityMatches: MatchedUniversityCourse[] = [];

  for (const uni of eligibleUniversities) {
    if (!uni.courses || uni.courses.length === 0) continue;

    const scoredCourses = uni.courses.map((course: any) => {
      const cat = (course.category || '').toLowerCase();
      const name = (course.name || '').toLowerCase();
      const textToMatch = `${name} ${cat}`;

      let score = 55;

      // 5.1 Evaluate against 16-Trait Permutation Categories
      const matchesPrimary = rule.primaryCategories.some((k) => textToMatch.includes(k));
      const matchesSecondary = rule.secondaryCategories.some((k) => textToMatch.includes(k));
      const matchesTertiary = rule.tertiaryCategories.some((k) => textToMatch.includes(k));

      if (matchesPrimary) {
        score += rule.primaryBoost;
      } else if (matchesSecondary) {
        score += rule.secondaryBoost;
      } else if (matchesTertiary) {
        score += rule.tertiaryBoost;
      } else {
        score += 14;
      }

      // 5.2 Academic Stream Compatibility & Bonus
      if (studentStream.includes('pcmb')) {
        if (cat.includes('science') || cat.includes('allied health') || cat.includes('engineering') || cat.includes('pharmacy') || cat.includes('biotech')) {
          score += 4;
        }
      } else if (studentStream.includes('pcm')) {
        if (cat.includes('engineering') || cat.includes('computer') || cat.includes('architecture') || cat.includes('technology')) {
          score += 4;
        }
      } else if (studentStream.includes('pcb')) {
        if (cat.includes('allied health') || cat.includes('pharmacy') || cat.includes('biotech') || cat.includes('psychology') || cat.includes('nursing')) {
          score += 5;
        } else if (cat.includes('engineering') && !name.includes('biomedical') && !name.includes('biotech')) {
          score -= 10; // Not typically eligible for non-bio engineering
        }
      } else if (studentStream.includes('computer')) {
        if (cat.includes('computer') || cat.includes('engineering') || name.includes('data') || name.includes('ai')) {
          score += 4;
        }
      } else if (studentStream.includes('commerce')) {
        if (cat.includes('commerce') || cat.includes('management') || name.includes('bba') || name.includes('b.com') || name.includes('acca') || name.includes('cma') || name.includes('finance')) {
          score += 5;
        }
      } else if (studentStream.includes('arts') || studentStream.includes('humanities')) {
        if (cat.includes('arts') || cat.includes('humanities') || cat.includes('design') || cat.includes('law') || cat.includes('media')) {
          score += 5;
        }
      }

      // 5.3 Bound final score between 76% and 98%
      const matchScore = Math.min(98, Math.max(76, score));

      // 5.4 Generate Personalized Psychometric Fit Reason
      const fitReason = rule.rationaleGenerator(course.name, course.category, scoresObj);

      return {
        course,
        matchScore,
        fitReason,
      };
    });

    // Pick top scoring course for this university
    scoredCourses.sort((a, b) => b.matchScore - a.matchScore);
    const top = scoredCourses[0];

    const fitLevel: 'Optimal Fit' | 'Strong Fit' | 'Recommended Fit' =
      top.matchScore >= 92 ? 'Optimal Fit' : top.matchScore >= 85 ? 'Strong Fit' : 'Recommended Fit';

    universityMatches.push({
      rank: 0,
      universityId: uni.id,
      universityName: uni.name,
      universityCity: uni.city,
      universityLogo: uni.logoUrl,
      boothNumber: uni.boothNumber,
      isVisited: visitedUniIds.has(uni.id),
      courseId: top.course.id,
      courseName: top.course.name,
      category: top.course.category,
      level: top.course.level,
      marginType: top.course.marginType,
      marginValue: top.course.marginValue,
      matchScore: top.matchScore,
      fitLevel,
      fitReason: top.fitReason,
    });
  }

  // 6. Rank all Universities Descending by Match Score
  universityMatches.sort((a, b) => b.matchScore - a.matchScore);
  universityMatches.forEach((m, idx) => {
    m.rank = idx + 1;
  });

  const rawEventTitle = targetEvent?.title || 'Campus Square™ University Fair Series';
  const eventTitle = rawEventTitle.replace(/Campus Square(?!™)/g, 'Campus Square™');
  const eventCity = targetEvent?.city || 'Tamil Nadu Edition';
  const examRefNo = `OB-${participant.id.slice(0, 8).toUpperCase()}`;

  // 7. Base Executive Summary & Strengths from 16-Trait Matrix
  let executiveSummary = rule.defaultSummary(participant.fullName, participant.stream || 'General');
  let strengths = [...rule.strengths];
  let careerTrajectories = [...rule.careerTrajectories];

  // 8. Dynamic AI Enrichment (OpenAI gpt-4o-mini)
  if (process.env.OPENAI_API_KEY) {
    try {
      const top3UniSummary = universityMatches
        .slice(0, 3)
        .map((u) => `${u.courseName} at ${u.universityName}`)
        .join(', ');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are a senior psychometric career strategist at OriginBI Mindworks. Generate precise, inspiring, professional academic fitment insights for a student based on their DISC personality trait blend and event university matches. Return strictly valid JSON.',
            },
            {
              role: 'user',
              content: `Candidate: ${participant.fullName}
Stream: ${participant.stream || 'Higher Secondary'}
Event Edition: ${eventTitle} (${eventCity})
Total Universities Evaluated: ${universityMatches.length}
DISC Scores: D=${scoreD}%, I=${scoreI}%, S=${scoreS}%, C=${scoreC}%
OriginBI Archetype: ${traitMeta.name} (${traitMeta.trait} • Code: ${blendedCode})
Top Matched University Courses: ${top3UniSummary}

Return JSON with exact keys:
"executiveSummary": (2 crisp sentences explaining why their specific ${blendedCode} trait blend naturally succeeds in these programs)
"strengths": (array of 3 short bullet points of cognitive & behavioral assets)
"careerTrajectories": (array of 3 target industry roles/disciplines)`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.6,
        }),
      });

      if (response.ok) {
        const aiData = await response.json();
        const parsed = JSON.parse(aiData.choices[0].message.content);
        if (parsed.executiveSummary) executiveSummary = parsed.executiveSummary;
        if (Array.isArray(parsed.strengths) && parsed.strengths.length > 0) strengths = parsed.strengths;
        if (Array.isArray(parsed.careerTrajectories) && parsed.careerTrajectories.length > 0)
          careerTrajectories = parsed.careerTrajectories;
      }
    } catch (aiErr) {
      console.warn('OpenAI enrichment fallback to deterministic 16-trait psychometric rules:', aiErr);
    }
  }

  return {
    participantId: participant.id,
    fullName: participant.fullName,
    mobile: participant.mobile,
    email: participant.email || 'N/A',
    stream: participant.stream || 'Higher Secondary',
    eventId: targetEvent?.id || '',
    eventTitle,
    eventCity,
    totalUniversitiesCount: universityMatches.length,
    visitedCount: visitedUniIds.size,
    examRefNo,
    completedAt: result.completedAt
      ? new Date(result.completedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : 'Verified Event Session',
    scores: scoresObj,
    primaryTrait: result.primaryTrait || primaryTraitCode,
    secondaryTrait: secondaryTraitCode,
    traitCode: blendedCode,
    archetypeName: traitMeta.name,
    archetypeColor: traitMeta.colorRgb,
    behavioralOrientation: traitMeta.trait,
    executiveSummary,
    strengths,
    careerTrajectories,
    matchedUniversities: universityMatches,
  };
}

// Backward-compatible alias
export const get19UniversityDiscMatches = getDiscCourseMatches;
