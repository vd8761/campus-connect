'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Mail,
  Phone,
  GraduationCap,
  BrainCircuit,
  Download,
  Filter,
  Sparkles,
} from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

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

// Dropdown options with all 16 Origin BI traits
const DISC_DROPDOWN_OPTIONS = [
  { id: 'all', name: 'All Traits' },

  // Dominance Quadrant
  { id: 'D', name: 'D • Bold Driver (Pure D)' },
  { id: 'DI', name: 'DI • Charismatic Leader' },
  { id: 'DS', name: 'DS • Strategic Stabilizer' },
  { id: 'DC', name: 'DC • Decisive Analyst' },

  // Influence Quadrant
  { id: 'I', name: 'I • Inspiring Motivator (Pure I)' },
  { id: 'ID', name: 'ID • Energetic Visionary' },
  { id: 'IS', name: 'IS • Supportive Energizer' },
  { id: 'IC', name: 'IC • Creative Thinker' },

  // Steadiness Quadrant
  { id: 'S', name: 'S • Steadfast Anchor (Pure S)' },
  { id: 'SD', name: 'SD • Reliable Executor' },
  { id: 'SI', name: 'SI • Collaborative Optimist' },
  { id: 'SC', name: 'SC • Dependable Specialist' },

  // Conscientiousness Quadrant
  { id: 'C', name: 'C • Precise Perfectionist (Pure C)' },
  { id: 'CD', name: 'CD • Analytical Leader' },
  { id: 'CI', name: 'CI • Logical Innovator' },
  { id: 'CS', name: 'CS • Structured Supporter' },
];

interface AssessmentResult {
  id: string;
  scoreD: number;
  scoreI: number;
  scoreS: number;
  scoreC: number;
  primaryTrait: string;
  profileType: string;
  skillDocumentUrl?: string | null;
  completedAt: string | Date;
}

interface Participant {
  id: string;
  fullName: string;
  email: string | null;
  mobile: string | null;
  category: string | null;
  currentStandard: string | null;
  schoolLevel: string | null;
  stream: string | null;
  gender: string | null;
  createdAt: string | Date;
  assessmentResult: AssessmentResult | null;
  boothVisits?: any[];
  _count?: { boothVisits: number };
}

export function DiscProfilesTable({ participants }: { participants: Participant[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [traitFilter, setTraitFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Participant | null>(null);

  // Derived metrics
  const totalCount = participants.length;
  const completedCount = participants.filter((p) => p.assessmentResult !== null).length;
  const pendingCount = totalCount - completedCount;

  const getTraitName = (code: string) => {
    const c = (code || '').toUpperCase();
    if (c.startsWith('D')) return 'Dominance';
    if (c.startsWith('I')) return 'Influence';
    if (c.startsWith('S')) return 'Steadiness';
    if (c.startsWith('C')) return 'Conscientiousness';
    return code || 'General';
  };

  // Resolves the exact Origin BI Blended Style from personality_traits table
  const resolveOriginBiStyle = (res: AssessmentResult | null | undefined) => {
    if (!res) return null;

    // Check if profileType matches any Origin BI blended style directly
    const directMatch = Object.values(ORIGINBI_16_TRAITS).find(
      (t) =>
        t.name.toLowerCase() === (res.profileType || '').toLowerCase() ||
        t.code.toUpperCase() === (res.profileType || '').toUpperCase()
    );
    if (directMatch) return directMatch;

    // Calculate ranking using Origin BI standard algorithm
    const scores = [
      { factor: 'D', score: Number(res.scoreD) || 0, priority: 3 },
      { factor: 'I', score: Number(res.scoreI) || 0, priority: 2 },
      { factor: 'S', score: Number(res.scoreS) || 0, priority: 1 },
      { factor: 'C', score: Number(res.scoreC) || 0, priority: 4 },
    ];

    scores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.priority - a.priority;
    });

    const top = scores[0];
    const second = scores[1];
    const total = scores.reduce((sum, s) => sum + s.score, 0);

    // If top trait has >= 50% dominance, resolve as pure trait
    if (total > 0 && top.score * 2 >= total) {
      return ORIGINBI_16_TRAITS[top.factor] || null;
    }

    // Otherwise blended style: top 2 traits
    const resolvedCode = `${top.factor}${second.factor}`;
    return (
      ORIGINBI_16_TRAITS[resolvedCode] ||
      ORIGINBI_16_TRAITS[top.factor] || {
        code: top.factor,
        name: res.profileType || 'General Style',
        trait: getTraitName(top.factor),
        description: 'Demonstrates balanced behavioral adaptability.',
        colorRgb: '0,173,76',
      }
    );
  };

  // Filtered List across Search, Status, and All 16 Origin BI Styles
  const filteredList = useMemo(() => {
    return participants.filter((p) => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const name = (p.fullName || '').toLowerCase();
      const email = (p.email || '').toLowerCase();
      const mobile = (p.mobile || '').toLowerCase();
      const matchesSearch =
        !query || name.includes(query) || email.includes(query) || mobile.includes(query);

      // Status matching
      const hasResult = p.assessmentResult !== null;
      let matchesStatus = true;
      if (statusFilter === 'completed') matchesStatus = hasResult;
      if (statusFilter === 'pending') matchesStatus = !hasResult;

      // Trait matching: EXACT match with selected style code
      let matchesTrait = true;
      if (traitFilter !== 'all') {
        if (!p.assessmentResult) {
          matchesTrait = false;
        } else {
          const style = resolveOriginBiStyle(p.assessmentResult);
          matchesTrait = style ? style.code === traitFilter : false;
        }
      }

      return matchesSearch && matchesStatus && matchesTrait;
    });
  }, [participants, searchQuery, statusFilter, traitFilter]);

  // CSV Export
  const exportCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Mobile',
      'Category',
      'Standard/Level',
      'Status',
      'Score D',
      'Score I',
      'Score S',
      'Score C',
      'Trait Code',
      'Trait Name',
      'Trait Blend',
      'Completed At',
    ];

    const rows = filteredList.map((p) => {
      const res = p.assessmentResult;
      const style = resolveOriginBiStyle(res);
      return [
        p.fullName || '',
        p.email || '',
        p.mobile || '',
        p.category || '',
        p.currentStandard || p.schoolLevel || '',
        res ? 'COMPLETED' : 'PENDING',
        res ? res.scoreD : '',
        res ? res.scoreI : '',
        res ? res.scoreS : '',
        res ? res.scoreC : '',
        style ? style.code : '',
        style ? style.name : '',
        style ? style.trait : '',
        res ? new Date(res.completedAt).toISOString() : '',
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `disc-profiles-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Selected student modal details
  const selRes = selectedStudent?.assessmentResult;
  const selStyle = resolveOriginBiStyle(selRes);
  const rawD = selRes ? Math.round(selRes.scoreD) : 0;
  const rawI = selRes ? Math.round(selRes.scoreI) : 0;
  const rawS = selRes ? Math.round(selRes.scoreS) : 0;
  const rawC = selRes ? Math.round(selRes.scoreC) : 0;
  const totalDiscScore = rawD + rawI + rawS + rawC;

  const primaryFactor = selStyle ? selStyle.code.charAt(0) : '';
  const secondaryFactor = selStyle && selStyle.code.length > 1 ? selStyle.code.charAt(1) : '';

  const modalBreakdown = [
    {
      code: 'D',
      trait: 'Dominance',
      score: rawD,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50/50',
      borderColor: 'border-rose-200',
      barColor: 'bg-rose-500',
      share: totalDiscScore > 0 ? Math.round((rawD / totalDiscScore) * 100) : 0,
      note: 'Direct, decisive, results-oriented, takes charge and drives momentum.',
    },
    {
      code: 'I',
      trait: 'Influence',
      score: rawI,
      color: 'text-amber-800',
      bgColor: 'bg-amber-50/50',
      borderColor: 'border-amber-200',
      barColor: 'bg-amber-500',
      share: totalDiscScore > 0 ? Math.round((rawI / totalDiscScore) * 100) : 0,
      note: 'Enthusiastic, persuasive, collaborative, and relationship-builder.',
    },
    {
      code: 'S',
      trait: 'Steadiness',
      score: rawS,
      color: 'text-emerald-800',
      bgColor: 'bg-emerald-50/50',
      borderColor: 'border-emerald-200',
      barColor: 'bg-emerald-500',
      share: totalDiscScore > 0 ? Math.round((rawS / totalDiscScore) * 100) : 0,
      note: 'Patient, reliable, calm, consistent team player, values stability.',
    },
    {
      code: 'C',
      trait: 'Conscientiousness',
      score: rawC,
      color: 'text-blue-800',
      bgColor: 'bg-blue-50/50',
      borderColor: 'border-blue-200',
      barColor: 'bg-blue-500',
      share: totalDiscScore > 0 ? Math.round((rawC / totalDiscScore) * 100) : 0,
      note: 'Precise, analytical, systematic, high standard of quality and logic.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-brand-border/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Candidates
            </p>
            <h3 className="text-2xl font-black text-brand-navy mt-1">{totalCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Assessment Completed
            </p>
            <h3 className="text-2xl font-black text-brand-navy mt-1">{completedCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Assessment Pending
            </p>
            <h3 className="text-2xl font-black text-brand-navy mt-1">{pendingCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Main Data Table Card */}
      <div className="bg-white rounded-2xl border border-brand-border/80 shadow-2xs overflow-hidden">
        {/* Toolbar: Search, Filters & Export */}
        <div className="p-4 sm:p-5 border-b border-brand-border/60 flex flex-col md:flex-row gap-3.5 md:items-center justify-between bg-slate-50/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={15} />
              </div>
              <input
                type="text"
                placeholder="Search candidates by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm border border-brand-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex rounded-xl bg-slate-200/70 p-1 text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${statusFilter === 'all'
                    ? 'bg-white text-brand-navy shadow-xs font-bold'
                    : 'text-slate-600 hover:text-brand-navy'
                  }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${statusFilter === 'completed'
                    ? 'bg-white text-brand-navy shadow-xs font-bold'
                    : 'text-slate-600 hover:text-brand-navy'
                  }`}
              >
                Completed ({completedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${statusFilter === 'pending'
                    ? 'bg-white text-brand-navy shadow-xs font-bold'
                    : 'text-slate-600 hover:text-brand-navy'
                  }`}
              >
                Pending ({pendingCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Searchable Dropdown for all 16 Origin BI Traits */}
            <div className="w-64 sm:w-72">
              <SearchableDropdown
                options={DISC_DROPDOWN_OPTIONS}
                value={traitFilter}
                onChange={(val) => setTraitFilter(val)}
                placeholder="All Traits"
                searchPlaceholder="Search 16 styles & traits..."
                align="right"
                icon={Filter}
                buttonClassName="h-10 text-xs font-semibold rounded-xl bg-white border-brand-border/80"
              />
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={exportCSV}
              className="h-10 px-3.5 rounded-xl border border-brand-border/80 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Download size={14} className="text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-brand-border/60 text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 min-w-[280px]">Candidate & Contact</th>
                <th className="py-3.5 px-3 text-center text-rose-700 font-bold w-14">D</th>
                <th className="py-3.5 px-3 text-center text-amber-700 font-bold w-14">I</th>
                <th className="py-3.5 px-3 text-center text-emerald-700 font-bold w-14">S</th>
                <th className="py-3.5 px-3 text-center text-blue-700 font-bold w-14">C</th>
                <th className="py-3.5 px-4 min-w-[220px]">Trait</th>
                <th className="py-3.5 px-4 text-center w-28">Status</th>
                <th className="py-3.5 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {filteredList.length > 0 ? (
                filteredList.map((participant) => {
                  const res = participant.assessmentResult;
                  const hasResult = res !== null;
                  const styleInfo = resolveOriginBiStyle(res);
                  const initials = participant.fullName
                    ? participant.fullName
                      .split(' ')
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                    : 'C';

                  // Trait factor highlights for candidate
                  const isPrimaryD = styleInfo?.code.charAt(0) === 'D';
                  const isSecondaryD =
                    styleInfo && styleInfo.code.length > 1 && styleInfo.code.charAt(1) === 'D';

                  const isPrimaryI = styleInfo?.code.charAt(0) === 'I';
                  const isSecondaryI =
                    styleInfo && styleInfo.code.length > 1 && styleInfo.code.charAt(1) === 'I';

                  const isPrimaryS = styleInfo?.code.charAt(0) === 'S';
                  const isSecondaryS =
                    styleInfo && styleInfo.code.length > 1 && styleInfo.code.charAt(1) === 'S';

                  const isPrimaryC = styleInfo?.code.charAt(0) === 'C';
                  const isSecondaryC =
                    styleInfo && styleInfo.code.length > 1 && styleInfo.code.charAt(1) === 'C';

                  return (
                    <tr
                      key={participant.id}
                      onClick={() => setSelectedStudent(participant)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Candidate & Contact Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple font-black text-xs flex items-center justify-center shrink-0 border border-brand-purple/20 group-hover:bg-brand-purple group-hover:text-white transition-colors">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-brand-navy text-sm group-hover:text-brand-purple transition-colors truncate">
                                {participant.fullName}
                              </span>
                              {(participant.currentStandard ||
                                participant.schoolLevel ||
                                participant.category) && (
                                  <span className="text-[11px] font-medium text-slate-500">
                                    •{' '}
                                    {participant.currentStandard ||
                                      participant.schoolLevel ||
                                      participant.category}
                                    {participant.stream ? ` (${participant.stream})` : ''}
                                  </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                              {participant.email && (
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Mail size={12} className="text-slate-400 shrink-0" />
                                  <span className="truncate max-w-[200px]">{participant.email}</span>
                                </span>
                              )}
                              {participant.mobile && (
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Phone size={12} className="text-slate-400 shrink-0" />
                                  <span>{participant.mobile}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* D Score */}
                      <td className="py-3.5 px-3 text-center">
                        {hasResult ? (
                          <span
                            className={`font-mono text-sm inline-block px-2 py-0.5 rounded-md transition-all ${isPrimaryD
                                ? 'font-black text-rose-700 bg-rose-50 border border-rose-200 shadow-2xs'
                                : isSecondaryD
                                  ? 'font-bold text-rose-600 bg-rose-50/70 border border-dashed border-rose-300'
                                  : 'font-medium text-slate-600'
                              }`}
                            title={
                              isPrimaryD
                                ? 'Primary Trait (Dominance)'
                                : isSecondaryD
                                  ? 'Secondary Trait (Dominance)'
                                  : undefined
                            }
                          >
                            {res.scoreD}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* I Score */}
                      <td className="py-3.5 px-3 text-center">
                        {hasResult ? (
                          <span
                            className={`font-mono text-sm inline-block px-2 py-0.5 rounded-md transition-all ${isPrimaryI
                                ? 'font-black text-amber-800 bg-amber-50 border border-amber-200 shadow-2xs'
                                : isSecondaryI
                                  ? 'font-bold text-amber-700 bg-amber-50/70 border border-dashed border-amber-300'
                                  : 'font-medium text-slate-600'
                              }`}
                            title={
                              isPrimaryI
                                ? 'Primary Trait (Influence)'
                                : isSecondaryI
                                  ? 'Secondary Trait (Influence)'
                                  : undefined
                            }
                          >
                            {res.scoreI}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* S Score */}
                      <td className="py-3.5 px-3 text-center">
                        {hasResult ? (
                          <span
                            className={`font-mono text-sm inline-block px-2 py-0.5 rounded-md transition-all ${isPrimaryS
                                ? 'font-black text-emerald-800 bg-emerald-50 border border-emerald-200 shadow-2xs'
                                : isSecondaryS
                                  ? 'font-bold text-emerald-700 bg-emerald-50/70 border border-dashed border-emerald-300'
                                  : 'font-medium text-slate-600'
                              }`}
                            title={
                              isPrimaryS
                                ? 'Primary Trait (Steadiness)'
                                : isSecondaryS
                                  ? 'Secondary Trait (Steadiness)'
                                  : undefined
                            }
                          >
                            {res.scoreS}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* C Score */}
                      <td className="py-3.5 px-3 text-center">
                        {hasResult ? (
                          <span
                            className={`font-mono text-sm inline-block px-2 py-0.5 rounded-md transition-all ${isPrimaryC
                                ? 'font-black text-blue-800 bg-blue-50 border border-blue-200 shadow-2xs'
                                : isSecondaryC
                                  ? 'font-bold text-blue-700 bg-blue-50/70 border border-dashed border-blue-300'
                                  : 'font-medium text-slate-600'
                              }`}
                            title={
                              isPrimaryC
                                ? 'Primary Trait (Conscientiousness)'
                                : isSecondaryC
                                  ? 'Secondary Trait (Conscientiousness)'
                                  : undefined
                            }
                          >
                            {res.scoreC}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Origin BI Database Trait with exact color_rgb */}
                      <td className="py-3 px-4">
                        {styleInfo ? (
                          <div
                            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all"
                            style={{
                              backgroundColor: `rgba(${styleInfo.colorRgb}, 0.08)`,
                              borderColor: `rgba(${styleInfo.colorRgb}, 0.28)`,
                            }}
                          >
                            <span
                              className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs"
                              style={{
                                backgroundColor: `rgb(${styleInfo.colorRgb})`,
                                color: getContrastTextColor(styleInfo.colorRgb),
                              }}
                            >
                              {styleInfo.code}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-xs text-slate-900 block truncate leading-tight">
                                {styleInfo.name}
                              </span>
                              <span
                                className="text-[9.5px] font-semibold block truncate leading-tight mt-0.5"
                                style={{ color: `rgb(${styleInfo.colorRgb})` }}
                              >
                                {styleInfo.trait}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not evaluated</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {hasResult ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 size={12} />
                            <span>Done</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            <Clock size={12} />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(participant);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white font-bold text-xs inline-flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-brand-navy text-sm">No candidates match your search</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive DISC Assessment Dossier Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-brand-navy p-6 text-white shrink-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none" />
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20 cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
                    <BrainCircuit size={13} />
                    <span>Origin BI Behavioral Engine</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-heading font-extrabold">{selectedStudent.fullName}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-white/80">
                      {selectedStudent.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail size={13} className="text-brand-turquoise" />
                          <span>{selectedStudent.email}</span>
                        </span>
                      )}
                      {selectedStudent.mobile && (
                        <span className="flex items-center gap-1.5">
                          <Phone size={13} className="text-brand-turquoise" />
                          <span>{selectedStudent.mobile}</span>
                        </span>
                      )}
                      {(selectedStudent.currentStandard || selectedStudent.schoolLevel) && (
                        <span className="flex items-center gap-1.5">
                          <GraduationCap size={13} className="text-brand-turquoise" />
                          <span>{selectedStudent.currentStandard || selectedStudent.schoolLevel}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {selStyle && (
                    <div
                      className="rounded-2xl px-4 py-2.5 shrink-0 border shadow-sm flex items-center gap-3"
                      style={{
                        backgroundColor: `rgba(${selStyle.colorRgb}, 0.15)`,
                        borderColor: `rgba(${selStyle.colorRgb}, 0.4)`,
                      }}
                    >
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: `rgb(${selStyle.colorRgb})`,
                          color: getContrastTextColor(selStyle.colorRgb),
                        }}
                      >
                        {selStyle.code}
                      </span>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-white/80 block">
                          Trait
                        </span>
                        <span className="text-sm font-black text-white">
                          {selStyle.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {selRes ? (
                <>
                  {/* Harmonious 4 DISC Score Cards */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        DISC Psychometric Scores
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {modalBreakdown.map((item) => {
                        const isPrimary = item.code === primaryFactor;
                        const isSecondary = item.code === secondaryFactor;
                        return (
                          <div
                            key={item.code}
                            className={`p-3.5 rounded-xl border transition-all ${item.borderColor} ${item.bgColor}`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-xs font-black ${item.color} tracking-wider`}>
                                {item.code} - {item.trait}
                              </span>
                              {isPrimary ? (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 shadow-2xs">
                                  Primary
                                </span>
                              ) : isSecondary ? (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/70 border border-dashed border-slate-300 text-slate-600">
                                  Secondary
                                </span>
                              ) : null}
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                              <span className="text-2xl font-black text-brand-navy leading-none">
                                {item.score}
                              </span>
                              <span className="text-[11px] font-bold text-slate-500">
                                {item.share}%
                              </span>
                            </div>
                            {/* Full-width clean progress bar */}
                            <div className="w-full bg-slate-200/60 rounded-full h-1.5 mt-2.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${item.barColor}`}
                                style={{ width: `${Math.min(100, Math.max(item.share, 4))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Origin BI Value-wise Breakdown Table */}
                  <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-brand-border/70">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-brand-navy">
                          DISC Value-wise Breakdown
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Origin BI Assessment Model
                        </p>
                      </div>
                      {selStyle && (
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg border"
                          style={{
                            backgroundColor: `rgba(${selStyle.colorRgb}, 0.1)`,
                            borderColor: `rgba(${selStyle.colorRgb}, 0.3)`,
                            color: '#0f172a',
                          }}
                        >
                          {selStyle.code} • {selStyle.name}
                        </span>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-white text-slate-700 border-b border-brand-border/60">
                            <th className="py-2 px-3 text-left font-bold rounded-l-lg">Trait</th>
                            <th className="py-2 px-3 text-center font-bold">Score</th>
                            <th className="py-2 px-3 text-center font-bold">Share</th>
                            <th className="py-2 px-3 text-left font-bold rounded-r-lg">
                              Behavioral Characteristic
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/40">
                          {modalBreakdown.map((item) => (
                            <tr key={item.code} className="hover:bg-white/80 transition-colors">
                              <td className="py-2.5 px-3 font-bold text-brand-navy whitespace-nowrap">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${item.barColor} mr-2`} />
                                {item.trait} ({item.code})
                              </td>
                              <td className="py-2.5 px-3 text-center font-black text-brand-navy text-sm whitespace-nowrap">
                                {item.score}
                              </td>
                              <td className="py-2.5 px-3 text-center font-semibold text-slate-600 whitespace-nowrap">
                                {item.share}%
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 leading-relaxed">
                                {item.note}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-brand-navy text-white font-bold text-xs">
                            <td className="py-2.5 px-3 rounded-l-lg">
                              Trait: {selStyle ? `${selStyle.code} • ${selStyle.name}` : primaryFactor}
                            </td>
                            <td className="py-2.5 px-3 text-center text-sm font-black">
                              {totalDiscScore}
                            </td>
                            <td className="py-2.5 px-3 text-center text-xs">100%</td>
                            <td className="py-2.5 px-3 text-right rounded-r-lg">
                              Core: {getTraitName(primaryFactor)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Behavioral Summary from Origin BI personality_traits table */}
                  <div className="p-4 bg-purple-50/60 rounded-xl border border-brand-purple/20">
                    <h5 className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles size={13} />
                      <span>Behavioral Profile Summary</span>
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selStyle?.description ||
                        'Demonstrates balanced behavioral adaptability across diverse academic and professional scenarios.'}
                    </p>
                  </div>

                  {/* Visited Booths */}
                  {selectedStudent.boothVisits && selectedStudent.boothVisits.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-brand-border/70">
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Visited University Booths ({selectedStudent.boothVisits.length})
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedStudent.boothVisits.map((visit: any) => (
                          <div
                            key={visit.id}
                            className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-brand-border/60 text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-brand-navy truncate">
                                {visit.university?.name}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {visit.university?.city || 'India'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
                    <Clock className="w-7 h-7 animate-pulse" />
                  </div>
                  <h3 className="text-base font-bold text-brand-navy">
                    Assessment Not Yet Completed
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    {selectedStudent.fullName} is registered for the conclave, but has not yet taken
                    their Origin BI DISC psychometric assessment.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-brand-border/60 bg-slate-50/70 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-white border border-brand-border text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
