const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

// Full comprehensive dataset of all 19 universities with their exact course offerings provided by the user
const UNIVERSITIES_CURRICULUM = [
  {
    name: 'Karpagam Academy of Higher Education',
    city: 'Coimbatore',
    country: 'India',
    logoUrl: '/university/2. Karpagam Academy of Higher Education.webp',
    description: 'Deemed to be University with NAAC A+ Accreditation',
    courses: [
      // UG
      { name: 'B.E. / B.Tech (CSE, AI & Data Science, ECE, EEE, Biotech, Food Tech, Civil, Mech)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.Arch (Bachelor of Architecture)', category: 'Architecture', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Pharm (Bachelor of Pharmacy)', category: 'Pharmacy', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'Pharm.D (Doctor of Pharmacy)', category: 'Pharmacy', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Sc. (Computer Science, AI/ML, Cyber Security, Biotech, IT)', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 18000 },
      { name: 'B.Com. (General, Professional Accounting, ACCA, FinTech)', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 18000 },
      { name: 'BBA (Bachelor of Business Administration)', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 18000 },
      { name: 'BCA (Bachelor of Computer Applications)', category: 'Computer Applications', level: 'UG', marginType: 'FIXED', marginValue: 18000 },
      { name: 'B.Des. (Interior Design, Fashion Design)', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.A. (Music, Violin, Bharatanatyam)', category: 'Arts', level: 'UG', marginType: 'FIXED', marginValue: 15000 },
      // PG
      { name: 'M.E. / M.Tech (Engineering Specializations)', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'M.Arch (Master of Architecture)', category: 'Architecture', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'M.Plan (Master of Planning)', category: 'Architecture', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'MBA (Master of Business Administration)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'MCA (Master of Computer Applications)', category: 'Computer Applications', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'M.Pharm (Master of Pharmacy)', category: 'Pharmacy', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'M.Sc. (Sciences)', category: 'Science', level: 'PG', marginType: 'FIXED', marginValue: 20000 },
      { name: 'M.Com. (Master of Commerce)', category: 'Commerce', level: 'PG', marginType: 'FIXED', marginValue: 20000 },
      // Doctoral
      { name: 'M.Phil. / Ph.D. Research Programs', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 35000 }
    ]
  },
  {
    name: 'Indian Institute of Commerce Lakshya',
    city: 'Kochi',
    country: 'India',
    logoUrl: '/university/1. Indian Institute of Commerce Lakshya.webp',
    description: 'Premier Commerce & Professional Accounting Education',
    courses: [
      { name: 'B.Com + CA (Chartered Accountancy)', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 20000 },
      { name: 'B.Com + ACCA (Association of Chartered Certified Accountants)', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 22000 },
      { name: 'B.Com + CMA USA (Certified Management Accountant)', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 20000 },
      { name: 'B.Voc + ACCA', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 18000 },
      { name: 'MBA + ACCA', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'MBA + CPA (Certified Public Accountant)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 32000 }
    ]
  },
  {
    name: 'Dr. Vishwanath Karad MIT World Peace University',
    city: 'Pune',
    country: 'India',
    logoUrl: '/university/4. MIT-WPU.webp',
    description: 'Pioneering Higher Education for Peace, Innovation & Tech',
    courses: [
      { name: 'B.Tech (CSE, AI & Data Science, Cloud, Cyber, Robotics, Mech, Civil, Biotech)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'BBA & B.Com Honours / Integrated BBA + MBA', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Sc & BCA (Computer Science, Data Science, Economics)', category: 'Computer Applications', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.Des & BA/BFA Honours (Filmmaking, Media, Photography)', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Arch & B.Pharm', category: 'Architecture', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'LL.B., BA/BBA LL.B. & B.Ed', category: 'Law', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'M.Tech (Computer Science, AI/ML, e-Mobility, Petroleum, Robotics)', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'MBA (Dual Specialization, Business Analytics, Finance, Digital Marketing)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'M.Sc & MCA', category: 'Science', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'M.Pharm & Pharm.D', category: 'Pharmacy', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'LL.M & PG Diplomas', category: 'Law', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'Ph.D. Doctoral Research Programs', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 40000 }
    ]
  },
  {
    name: 'Sunstone School of Technology & Management',
    city: 'Pan-India',
    country: 'India',
    logoUrl: '/university/5. Sunstone School of Technology & Management.webp',
    description: 'Career-Oriented Higher Education & Management Programs',
    courses: [
      { name: 'B.Tech (Full Stack Web Dev, Data Science, Cyber Security, AI & ML)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'BBA (Digital Marketing, Entrepreneurship, AI for Business)', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 20000 },
      { name: 'MBA / PGDM (Business Analytics, Marketing, Finance, IT & Systems)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'BCA (Data Science, Blockchain, Web Applications)', category: 'Computer Applications', level: 'UG', marginType: 'FIXED', marginValue: 20000 },
      { name: 'MCA (Master of Computer Applications)', category: 'Computer Applications', level: 'PG', marginType: 'FIXED', marginValue: 25000 }
    ]
  },
  {
    name: 'Sai University',
    city: 'Chennai',
    country: 'India',
    logoUrl: '/university/6. SAI University.webp',
    description: 'International University for Liberal Arts, Law & Computing',
    courses: [
      { name: 'B.A. (Hons.) (PPE, Economics, Psychology, Literature, Communication)', category: 'Arts', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Sc. (Hons.) (Psychology, Biology, Neuroscience, Mathematics, Physics)', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Tech (Computing & Data Science, CSE, Biotech, Environmental Engg)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'BBA (Hons.) (Business Intelligence & Analytics)', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Sc. Allied Health Sciences & Paramedical', category: 'Allied Health', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.Optom (Optometry) & BPT (Physiotherapy)', category: 'Allied Health', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.A. LL.B. (Hons.) & BBA LL.B. (Hons.) Integrated Law', category: 'Law', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'MBA & MCA', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'LL.M. & PG Diplomas in AI Healthcare / GenAI', category: 'Law', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'Ph.D. Doctoral Research Programs', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 40000 }
    ]
  },
  {
    name: 'Amity University',
    city: 'Coimbatore',
    country: 'India',
    logoUrl: '/university/7. Amity University.webp',
    description: 'Leading Research & Innovation Driven University',
    courses: [
      { name: 'B.Tech / B.E. (Engineering)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'BBA & BBA Honours with Research', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'BCA & B.Sc. / B.A. Programmes', category: 'Computer Applications', level: 'UG', marginType: 'FIXED', marginValue: 22000 },
      { name: 'B.Arch & B.Pharm', category: 'Architecture', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'LL.B., B.A. LL.B. & BBA LL.B. Law', category: 'Law', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'MBA (Dual Specialization)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'M.Tech / M.E. & MCA', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'M.Sc., M.A. & LL.M.', category: 'Science', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'Ph.D. Doctor of Philosophy', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 40000 }
    ]
  },
  {
    name: 'Woxsen University',
    city: 'Hyderabad',
    country: 'India',
    logoUrl: '/university/8. Woxsen University.webp',
    description: 'Top Ranked Private University for Tech, Business & Design',
    courses: [
      { name: 'B.Tech (CSE, Data Science, AI & ML, Blockchain, IoT, Cybersecurity)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'BBA / BBA (Hons.)', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'BA (Hons.) Liberal Arts & Humanities', category: 'Arts', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Sc. (Hons.) Data Science, AI & Applied Sciences', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Sc. Sports Science', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Des (Hons.) Bachelor of Design', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Arch & BA LLB / BBA LLB (Hons.)', category: 'Architecture', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'MBA & Integrated BBA + MBA', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'M.Tech (AI & ML) & M.Des (Product Design Innovation)', category: 'Design', level: 'PG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'Ph.D. Research Programs (Tech, Business, Law, Arts)', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 45000 }
    ]
  },
  {
    name: 'PSG Institute of Advanced Studies',
    city: 'Coimbatore',
    country: 'India',
    logoUrl: '/university/9. PSG Institute of Advanced Studies.webp',
    description: 'International Credit Transfer & Advanced Research',
    courses: [
      { name: 'BEng Mechanical Engineering (3 Yrs PSGIAS + 1 Yr Univ of Hull, UK)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'BE (Hons) Mechatronics / Software Engg (2 Yrs PSGIAS + 2 Yrs Deakin, Australia)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'BEng (Hons) Robotics & Automation (3 Yrs PSGIAS + 1 Yr Leeds Beckett, UK)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'BEng Computer Engineering (2 Yrs PSGIAS + 2 Yrs Queen’s Univ Belfast, UK)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'BS Biomedical & Electrical Engineering (2 Yrs PSGIAS + 3 Yrs Colorado State, USA)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 50000 },
      { name: 'BA (Hons) International Business / Fashion Design (UK Partner Universities)', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'MSc Artificial Intelligence for Business (Hull, UK)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'MS Industrial Engineering (Univ of Toledo, USA)', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'PG Diploma in Tool & Die Design & Ph.D. Programs', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 30000 }
    ]
  },
  {
    name: 'RV University',
    city: 'Bengaluru',
    country: 'India',
    logoUrl: '/university/10. RV University.webp',
    description: 'New-Age Global University for Liberal Arts, Design & Tech',
    courses: [
      { name: 'B.Tech. (Hons.) (CSE, Electronics & Communication)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Des. (Hons.) (User Experience, Product, Communication)', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.A. (Hons.) & B.Sc. (Hons.) (Psychology, Economics, Data Science, AIML)', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'BBA (Hons.) (Business Analytics, Entrepreneurship, Supply Chain)', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'BCA (Hons.) & B.Com. (Hons.) with ACCA/USCMA', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 28000 },
      { name: 'Integrated Law (B.A. LL.B. Hons. / BBA LL.B. Hons.)', category: 'Law', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'MBA (Data Science & AI / General)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'M.Tech., M.Des. (UX Design) & LL.M.', category: 'Design', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'Ph.D. Doctoral Research Programs', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 40000 }
    ]
  },
  {
    name: 'Strate School of Design',
    city: 'Bengaluru',
    country: 'India',
    logoUrl: '/university/11. Strate School of Design.webp',
    description: 'Premier French Design School in India',
    courses: [
      { name: 'B.Des (Hons) / B.Sc in Transportation Design', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'B.Des (Hons) Product Design & Spatial Design', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'B.Des (Hons) Interaction Design (UI/UX) & Game Design', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'B.Sc in Brand Identity & Visual Communications Design', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'Integrated B.Sc. + M.Sc. in Design (5 Years)', category: 'Design', level: 'PG', marginType: 'FIXED', marginValue: 50000 },
      { name: 'M.Sc. / Master in Design (Transportation, UI/UX, Product)', category: 'Design', level: 'PG', marginType: 'FIXED', marginValue: 45000 }
    ]
  },
  {
    name: 'Shiv Nadar University Chennai',
    city: 'Chennai',
    country: 'India',
    logoUrl: '/university/12. Shiv Nadar University Chennai.webp',
    description: 'Leading Global Research-Led Institution',
    courses: [
      { name: 'B.Tech (AI & Data Science, CSE IoT & Cyber Security, IT, ECE, EEE, Mech, Civil)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Com / B.Com (Hons) (Professional Accounting)', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.Sc Economics (Data Science)', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.A. LL.B. (Hons.) Integrated Law Program', category: 'Law', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'M.Tech (CSE, AI & Data Science, VLSI Design, Power Electronics)', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'MBA Business Administration', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'Ph.D. Doctoral Programs', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 40000 }
    ]
  },
  {
    name: 'Plaksha University',
    city: 'Mohali',
    country: 'India',
    logoUrl: '/university/13. Plaksha University.webp',
    description: 'Reimagining Tech Education & Future Research',
    courses: [
      { name: 'B.Tech in Computer Science & Artificial Intelligence (CSAI)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'B.Tech in Robotics & Autonomous Systems (RAS)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'B.Tech in Biological Systems Engineering (BSE)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'B.Tech in Data Science, Economics & Business (DSEB)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'M.Sc. / Master’s in AI & Technology Fields', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'Ph.D. in AI, Data Science & Robotics', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 50000 }
    ]
  },
  {
    name: 'PPG Group of Institutions',
    city: 'Coimbatore',
    country: 'India',
    logoUrl: '/university/14. PPG Group of Institutions.webp',
    description: 'Multi-disciplinary Higher Education & Healthcare',
    courses: [
      { name: 'B.E. / B.Tech (CSE, Mech, EEE, ECE, Civil, IT, AI&DS, Robotics, Biomedical)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'M.E. / M.Tech, MBA & MCA', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.Sc. Nursing & Post Basic B.Sc. Nursing', category: 'Allied Health', level: 'UG', marginType: 'FIXED', marginValue: 20000 },
      { name: 'M.Sc. Nursing (Medical Surgical, OBG, Paediatric, Community)', category: 'Allied Health', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.Pharm, D.Pharm & Pharm.D', category: 'Pharmacy', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'M.Pharm (Pharmaceutics, Pharmacology)', category: 'Pharmacy', level: 'PG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'BPT (Bachelor of Physiotherapy) & MPT', category: 'Allied Health', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.Sc. Allied Health Sciences (Cardiology, Radiology, Dialysis, MLT, Perfusion)', category: 'Allied Health', level: 'UG', marginType: 'FIXED', marginValue: 22000 },
      { name: 'BBA, B.Com, B.Sc Arts & Science', category: 'Arts', level: 'UG', marginType: 'FIXED', marginValue: 15000 },
      { name: 'B.Ed & M.Ed Education & BOT Occupational Therapy', category: 'Allied Health', level: 'UG', marginType: 'FIXED', marginValue: 20000 }
    ]
  },
  {
    name: 'Krea University',
    city: 'Sri City',
    country: 'India',
    logoUrl: '/university/15. Krea University.webp',
    description: 'Pioneering Interwoven Learning & Thought Leadership',
    courses: [
      { name: 'B.A. / B.A. (Honours) Interwoven Arts & Humanities', category: 'Arts', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Sc. / B.Sc. (Honours) (Biotech, Computer Science, Data Science, Psychology)', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'BBA / BBA (Honours)', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'Krea-Macquarie 2+2 Dual Degree', category: 'Global Studies', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'MBA (Flagship Program by IFMR GSB)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'Integrated MBA (BBA + MBA - 5 Years)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'Ph.D. in Management & Data Science', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 45000 }
    ]
  },
  {
    name: 'I-Arch NATA-JEE (B.Arch) Institute',
    city: 'National',
    country: 'India',
    logoUrl: '/university/16. I-Arch NATA-JEE (B.Arch) Institute.webp',
    description: 'No. 1 Architecture & Design Entrance Academy',
    courses: [
      { name: '2-Year Weekend Course (NATA + JEE B.Arch for 11th/12th)', category: 'Architecture', level: 'Certification', marginType: 'FIXED', marginValue: 20000 },
      { name: '1-Year Long-Term Regular Course (NATA / JEE B.Arch)', category: 'Architecture', level: 'Certification', marginType: 'FIXED', marginValue: 18000 },
      { name: '4-Month Regular Classes & Crash Courses', category: 'Architecture', level: 'Certification', marginType: 'FIXED', marginValue: 15000 },
      { name: 'Architecture Software & 3D Visualization Courses', category: 'Design', level: 'Certification', marginType: 'FIXED', marginValue: 12000 },
      { name: 'GATE Architecture & PGETA Entrance Prep', category: 'Architecture', level: 'Certification', marginType: 'FIXED', marginValue: 16000 }
    ]
  },
  {
    name: 'Vellore Institute of Technology (VIT)',
    city: 'Vellore',
    country: 'India',
    logoUrl: '/university/17. VIT University.webp',
    description: 'Institution of Eminence & Premier Engineering University',
    courses: [
      { name: 'B.Tech (CSE, AI & ML, Civil, Mechanical, ECE, Biotech, Chemical, Aerospace)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'B.Arch & B.Des (Bachelor of Design)', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'BBA, BCA, B.Com & B.Sc. (Hons) Agriculture', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 28000 },
      { name: 'BBA (Financial Analytics 2+2 with Binghamton Univ, USA)', category: 'Global Studies', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'M.Tech, MCA & MBA', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'M.Des, LL.M, M.Arch & MSW', category: 'Design', level: 'PG', marginType: 'FIXED', marginValue: 32000 },
      { name: 'Integrated M.Tech / Integrated M.Sc (5 Years)', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'Integrated Law (B.A. LL.B / B.B.A. LL.B)', category: 'Law', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'Ph.D. / Integrated Ph.D.', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 45000 }
    ]
  },
  {
    name: 'Amity University, Bangalore',
    city: 'Bengaluru',
    country: 'India',
    logoUrl: '/university/18. Amity University, Bangalore.webp',
    description: 'State-of-the-Art Global Campus in Tech Hub',
    courses: [
      { name: 'B.Tech (CSE, AI & ML, Data Analytics, Robotics, IoT, Cloud, Biotech, ECE)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Des (Fashion Design)', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.A. LL.B (Hons) / B.A., LL.B & LL.B', category: 'Law', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'BBA (General, Business Analytics, International Twinning, CMA USA)', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Sc (Biotech, Animation & VFX, Physics/Maths/CS, Psychology)', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.Com (Hons), BCA & B.Pharm', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'MBA (Business Analytics, Marketing, Finance)', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'MCA, M.Tech, M.Sc & LL.M', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'Ph.D. Programs (Engineering, Tech, Management, Law, Psychology)', category: 'Research', level: 'Doctoral', marginType: 'FIXED', marginValue: 40000 }
    ]
  },
  {
    name: 'GOS Institution',
    city: 'Chennai',
    country: 'India',
    logoUrl: '/university/3. GOS Institution.webp',
    description: 'Excellence in Skill-based & Higher Education',
    courses: [
      { name: 'Long-Term / Regular Foundation (Grade XI Students - 2 Yrs)', category: 'Certification', level: 'Certification', marginType: 'FIXED', marginValue: 15000 },
      { name: 'Regular Batch (Grade XII & Graduate Students - 1 Yr)', category: 'Certification', level: 'Certification', marginType: 'FIXED', marginValue: 12000 },
      { name: 'Weekend / Hybrid Batches (School & College Students)', category: 'Certification', level: 'Certification', marginType: 'FIXED', marginValue: 10000 },
      { name: 'Crash Courses (Final-Stage Aspirants - 1 to 3 Mos)', category: 'Certification', level: 'Certification', marginType: 'FIXED', marginValue: 8000 },
      { name: 'Fast-Track Bootcamps (Situation Test, Studio Test, GD-PI)', category: 'Certification', level: 'Certification', marginType: 'FIXED', marginValue: 6000 }
    ]
  },
  {
    name: 'Edwise International',
    city: 'Pan-India',
    country: 'India',
    logoUrl: '/university/19. Edwise-logo.webp',
    description: 'Overseas Education & Global Admissions Consultant',
    courses: [
      { name: 'IELTS / PTE Academic Coaching (2 Months)', category: 'Global Studies', level: 'Certification', marginType: 'FIXED', marginValue: 12000 },
      { name: 'TOEFL Exam Coaching (4 Months)', category: 'Global Studies', level: 'Certification', marginType: 'FIXED', marginValue: 15000 },
      { name: 'GRE Exam Prep (1 Year - Quant & Verbal Training)', category: 'Global Studies', level: 'Certification', marginType: 'FIXED', marginValue: 20000 },
      { name: 'GMAT Exam Prep (1 Year Comprehensive)', category: 'Global Studies', level: 'Certification', marginType: 'FIXED', marginValue: 25000 },
      { name: 'Global Undergraduate Degrees (Bachelor’s in USA, Canada, UK, Aus, Germany)', category: 'Global Studies', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'Global Postgraduate Degrees (Master’s / MBA in UK, USA, Canada)', category: 'Global Studies', level: 'PG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'Global Diplomas / Advanced Diplomas (Canada, UK, Australia)', category: 'Global Studies', level: 'Diploma', marginType: 'FIXED', marginValue: 25000 },
      { name: 'Global Doctorate / Research Programs (PhD)', category: 'Global Studies', level: 'Doctoral', marginType: 'FIXED', marginValue: 45000 }
    ]
  }
];

async function syncAllCurriculums() {
  console.log("=== Syncing All 19 Universities and Exact Courses to Database ===");
  
  let totalUnis = 0;
  let totalCourses = 0;

  for (const uni of UNIVERSITIES_CURRICULUM) {
    // Check if university exists by name
    const existing = await sql`
      SELECT id FROM "University" 
      WHERE LOWER(name) = LOWER(${uni.name})
      LIMIT 1
    `;

    let uniId;
    if (existing && existing.length > 0) {
      uniId = existing[0].id;
      await sql`
        UPDATE "University"
        SET "logoUrl" = ${uni.logoUrl},
            description = ${uni.description},
            city = ${uni.city},
            country = ${uni.country},
            "updatedAt" = NOW()
        WHERE id = ${uniId}
      `;
    } else {
      uniId = randomUUID();
      await sql`
        INSERT INTO "University" (id, name, city, country, "logoUrl", description, "createdAt", "updatedAt")
        VALUES (${uniId}, ${uni.name}, ${uni.city}, ${uni.country}, ${uni.logoUrl}, ${uni.description}, NOW(), NOW())
      `;
    }
    totalUnis++;

    // Insert each course if not already present
    for (const c of uni.courses) {
      const existingCourse = await sql`
        SELECT id FROM "Course"
        WHERE "universityId" = ${uniId} AND LOWER(name) = LOWER(${c.name})
        LIMIT 1
      `;

      if (!existingCourse || existingCourse.length === 0) {
        await sql`
          INSERT INTO "Course" (id, "universityId", name, category, level, "marginType", "marginValue", "isActive")
          VALUES (${randomUUID()}, ${uniId}, ${c.name}, ${c.category}, ${c.level}, ${c.marginType}, ${c.marginValue}, true)
        `;
        totalCourses++;
      }
    }
  }

  // Also query total counts in DB now
  const allUnis = await sql`SELECT COUNT(*) FROM "University"`;
  const allCourses = await sql`SELECT COUNT(*) FROM "Course"`;

  console.log(`Success! Total Universities in DB: ${allUnis[0].count}`);
  console.log(`Total Courses in DB: ${allCourses[0].count}`);
}

syncAllCurriculums().catch(err => {
  console.error("Sync Error:", err);
  process.exit(1);
});
