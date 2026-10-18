// All 16 Classical Origin BI Personality Traits & Blended Styles
// Exact data and color_rgb directly from Origin BI database personality_traits table
export const ORIGINBI_16_TRAITS: Record<
  string,
  {
    code: string;
    name: string;
    trait: string;
    description: string;
    colorRgb: string;
  }
> = {
  // Pure Dominance & Blends
  D: {
    code: 'D',
    name: 'Bold Driver',
    trait: 'Pure Dominance',
    description:
      'Direct, driven, and results-focused, Bold Drivers take charge of challenges and push decisively toward their goals. They make fast decisions, thrive under pressure, and are energised by competition and ownership.',
    colorRgb: '255,49,49',
  },
  DI: {
    code: 'DI',
    name: 'Charismatic Leader',
    trait: 'Dominance • Influence',
    description:
      'Dynamic, confident, and people-centric, Charismatic Leaders chase ambitious goals while rallying others around a compelling vision. Decisive, comfortable with risk, and quick to initiate change.',
    colorRgb: '234,51,36',
  },
  DS: {
    code: 'DS',
    name: 'Strategic Stabilizer',
    trait: 'Dominance • Steadiness',
    description:
      'Strategic Stabilizers pair a results-oriented mindset with steady, methodical execution. They set clear targets and then build practical processes to reach them, paying attention to team harmony as much as deadlines.',
    colorRgb: '255,115,49',
  },
  DC: {
    code: 'DC',
    name: 'Decisive Analyst',
    trait: 'Dominance • Conscientiousness',
    description:
      'Analytical and forceful, Decisive Analysts demand logical, data-backed solutions delivered at speed. They challenge assumptions, slice through ambiguity, and set high performance bars.',
    colorRgb: '255,182,31',
  },

  // Pure Influence & Blends
  I: {
    code: 'I',
    name: 'Inspiring Motivator',
    trait: 'Pure Influence',
    description:
      'Outgoing, expressive, and people-first, Inspiring Motivators light up a room and win others over with optimism and warmth. They build rapport quickly, spark enthusiasm, and thrive on collaboration.',
    colorRgb: '232,178,54',
  },
  ID: {
    code: 'ID',
    name: 'Energetic Visionary',
    trait: 'Influence • Dominance',
    description:
      'Energetic Visionaries blend imaginative ideas with a bias for action. They persuade through storytelling, thrive on variety, and push projects forward with infectious optimism.',
    colorRgb: '255,213,0',
  },
  IS: {
    code: 'IS',
    name: 'Supportive Energizer',
    trait: 'Influence • Steadiness',
    description:
      'Warm, encouraging, and service-minded, Supportive Energizers cultivate a positive team spirit while keeping an eye on practical needs. They excel at informal coaching and fostering collaboration.',
    colorRgb: '255,232,0',
  },
  IC: {
    code: 'IC',
    name: 'Creative Thinker',
    trait: 'Influence • Conscientiousness',
    description:
      'Creative Thinkers pair imaginative flair with thoughtful analysis. They enjoy brainstorming novel solutions, then polishing them with careful research and aesthetic sensitivity.',
    colorRgb: '221,215,48',
  },

  // Pure Steadiness & Blends
  S: {
    code: 'S',
    name: 'Steadfast Anchor',
    trait: 'Pure Steadiness',
    description:
      'Calm, patient, and dependable, Steadfast Anchors bring steadiness and harmony to the teams they join. They listen closely, support others consistently, and value stability, trust, and a measured pace.',
    colorRgb: '0,173,76',
  },
  SD: {
    code: 'SD',
    name: 'Reliable Executor',
    trait: 'Steadiness • Dominance',
    description:
      'Dependable and goal-driven, Reliable Executors convert strategic plans into orderly, trackable actions. They value consistency, outline clear procedures, and persevere until results are reached.',
    colorRgb: '0,186,204',
  },
  SI: {
    code: 'SI',
    name: 'Collaborative Optimist',
    trait: 'Steadiness • Influence',
    description:
      'Collaborative Optimists foster cohesion and morale through empathy, patience, and an upbeat outlook. They are attentive listeners who build consensus and smooth workflows.',
    colorRgb: '0,200,137',
  },
  SC: {
    code: 'SC',
    name: 'Dependable Specialist',
    trait: 'Steadiness • Conscientiousness',
    description:
      'Precise, loyal, and process-oriented, Dependable Specialists deliver high-quality work by adhering to standards and anticipating risks. They prefer stable environments where expertise is valued.',
    colorRgb: '0,179,85',
  },

  // Pure Conscientiousness & Blends
  C: {
    code: 'C',
    name: 'Precise Perfectionist',
    trait: 'Pure Conscientiousness',
    description:
      'Analytical, careful, and quality-driven, Precise Perfectionists hold a high bar for accuracy and structure. They think things through, rely on evidence, and produce work that stands up to scrutiny.',
    colorRgb: '74,198,234',
  },
  CD: {
    code: 'CD',
    name: 'Analytical Leader',
    trait: 'Conscientiousness • Dominance',
    description:
      'Analytical Leaders couple rigorous logic with a drive for measurable achievement. They see patterns quickly, devise structured strategies, and hold teams accountable to objective metrics.',
    colorRgb: '0,151,230',
  },
  CI: {
    code: 'CI',
    name: 'Logical Innovator',
    trait: 'Conscientiousness • Influence',
    description:
      'Logical Innovators integrate systematic reasoning with imaginative "what-if" exploration. They enjoy stretching boundaries while ensuring every concept is technically sound.',
    colorRgb: '186,48,107',
  },
  CS: {
    code: 'CS',
    name: 'Structured Supporter',
    trait: 'Conscientiousness • Steadiness',
    description:
      'Structured Supporters are meticulous planners who keep teams grounded with well-documented workflows, risk logs, and clear quality checks. Courteous and patient, providing quiet stability behind the scenes.',
    colorRgb: '209,30,91',
  },
};

// Calculate contrast text color (white or dark slate) based on RGB luminance
export function getContrastTextColor(colorRgb: string): string {
  const parts = colorRgb.split(',').map((n) => parseInt(n.trim(), 10));
  if (parts.length < 3 || parts.some(isNaN)) return '#ffffff';
  const [r, g, b] = parts;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 165 ? '#0f172a' : '#ffffff';
}
