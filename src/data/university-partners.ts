export interface UniversityPartner {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  category: 'University' | 'Specialized Institute' | 'Global Education';
  location: string;
  description?: string;
}

export const UNIVERSITY_PARTNERS: UniversityPartner[] = [
  {
    id: 'lakshya',
    name: 'Indian Institute of Commerce Lakshya',
    shortName: 'IIC Lakshya',
    logo: '/university/1.%20Indian%20Institute%20of%20Commerce%20Lakshya.webp',
    category: 'Specialized Institute',
    location: 'Kochi & National',
    description: 'Premier Commerce & Professional Accounting Education'
  },
  {
    id: 'karpagam',
    name: 'Karpagam Academy of Higher Education',
    shortName: 'KAHE',
    logo: '/university/2.%20Karpagam%20Academy%20of%20Higher%20Education.webp',
    category: 'University',
    location: 'Coimbatore, Tamil Nadu',
    description: 'Deemed to be University with NAAC A+ Accreditation'
  },
  {
    id: 'gos',
    name: 'GOS Institution',
    shortName: 'GOS Institution',
    logo: '/university/3.%20GOS%20Institution.webp',
    category: 'Specialized Institute',
    location: 'India',
    description: 'Excellence in Skill-based & Higher Education'
  },
  {
    id: 'mit-wpu',
    name: 'Dr. Vishwanath Karad MIT World Peace University',
    shortName: 'MIT-WPU',
    logo: '/university/4.%20MIT-WPU.webp',
    category: 'University',
    location: 'Pune, Maharashtra',
    description: 'Pioneering Higher Education for Peace, Innovation & Tech'
  },
  {
    id: 'sunstone',
    name: 'Sunstone School of Technology & Management',
    shortName: 'Sunstone',
    logo: '/university/5.%20Sunstone%20School%20of%20Technology%20&%20Management.webp',
    category: 'Specialized Institute',
    location: 'Pan-India',
    description: 'Career-Oriented Higher Education & Management Programs'
  },
  {
    id: 'sai-university',
    name: 'Sai University',
    shortName: 'Sai University',
    logo: '/university/6.%20SAI%20University.webp',
    category: 'University',
    location: 'Chennai, Tamil Nadu',
    description: 'International University for Liberal Arts, Law & Computing'
  },
  {
    id: 'amity-university',
    name: 'Amity University',
    shortName: 'Amity University',
    logo: '/university/7.%20Amity%20University.webp',
    category: 'University',
    location: 'Coimbatore, Tamil Nadu',
    description: 'India’s Leading Research & Innovation Driven University'
  },
  {
    id: 'woxsen',
    name: 'Woxsen University',
    shortName: 'Woxsen University',
    logo: '/university/8.%20Woxsen%20University.webp',
    category: 'University',
    location: 'Hyderabad, Telangana',
    description: 'Ranked Top Private University for Tech, Business & Design'
  },
  {
    id: 'psg-ias',
    name: 'PSG Institute of Advanced Studies',
    shortName: 'PSG IAS',
    logo: '/university/9.%20PSG%20Institute%20of%20Advanced%20Studies.webp',
    category: 'University',
    location: 'Coimbatore, Tamil Nadu',
    description: 'International Credit Transfer & Advanced Research'
  },
  {
    id: 'rv-university',
    name: 'RV University',
    shortName: 'RV University',
    logo: '/university/10.%20RV%20University.webp',
    category: 'University',
    location: 'Bengaluru, Karnataka',
    description: 'New-Age Global University for Liberal Arts, Design & Tech'
  },
  {
    id: 'strate',
    name: 'Strate School of Design',
    shortName: 'Strate Design',
    logo: '/university/11.%20Strate%20School%20of%20Design.webp',
    category: 'Specialized Institute',
    location: 'Bengaluru / Paris',
    description: 'Premier French Design School in India'
  },
  {
    id: 'shiv-nadar',
    name: 'Shiv Nadar University Chennai',
    shortName: 'SNU Chennai',
    logo: '/university/12.%20Shiv%20Nadar%20University%20Chennai.webp',
    category: 'University',
    location: 'Chennai, Tamil Nadu',
    description: 'Leading Global Research-Led Institution'
  },
  {
    id: 'plaksha',
    name: 'Plaksha University',
    shortName: 'Plaksha University',
    logo: '/university/13.%20Plaksha%20University.webp',
    category: 'University',
    location: 'Mohali, Punjab',
    description: 'Reimagining Tech Education & Future Research'
  },
  {
    id: 'ppg',
    name: 'PPG Group of Institutions',
    shortName: 'PPG Institutions',
    logo: '/university/14.%20PPG%20Group%20of%20Institutions.webp',
    category: 'Specialized Institute',
    location: 'Coimbatore, Tamil Nadu',
    description: 'Multi-disciplinary Higher Education & Healthcare'
  },
  {
    id: 'krea',
    name: 'Krea University',
    shortName: 'Krea University',
    logo: '/university/15.%20Krea%20University.webp',
    category: 'University',
    location: 'Sri City, Andhra Pradesh',
    description: 'Pioneering Interwoven Learning & Thought Leadership'
  },
  {
    id: 'i-arch',
    name: 'I-Arch NATA-JEE (B.Arch) Institute',
    shortName: 'I-Arch Institute',
    logo: '/university/16.%20I-Arch%20NATA-JEE%20(B.Arch)%20Institute.webp',
    category: 'Specialized Institute',
    location: 'National',
    description: 'India’s No. 1 Architecture & Design Entrance Academy'
  },
  {
    id: 'vit',
    name: 'Vellore Institute of Technology (VIT)',
    shortName: 'VIT University',
    logo: '/university/17.%20VIT%20University.webp',
    category: 'University',
    location: 'Vellore, Tamil Nadu',
    description: 'Institution of Eminence & Premier Engineering University'
  },
  {
    id: 'amity-bangalore',
    name: 'Amity University, Bangalore',
    shortName: 'Amity Bangalore',
    logo: '/university/18.%20Amity%20University,%20Bangalore.webp',
    category: 'University',
    location: 'Bengaluru, Karnataka',
    description: 'State-of-the-Art Global Campus in Tech Hub'
  },
  {
    id: 'edwise',
    name: 'Edwise International',
    shortName: 'Edwise',
    logo: '/university/19.%20Edwise-logo.webp',
    category: 'Global Education',
    location: 'Pan-India & International',
    description: 'India’s Leading Overseas Education & Global Admissions Consultant'
  }
];
