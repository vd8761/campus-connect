import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { sendEnquiryNotificationEmail, getFromEmailAddress } from '../src/lib/email';

const from = getFromEmailAddress();
const to = process.env.ENQUIRY_NOTIFICATION_EMAIL || 'ariyappan@touchmarkdes.com';
const cc = process.env.ENQUIRY_NOTIFICATION_CC;
const bcc = process.env.ENQUIRY_NOTIFICATION_BCC;

console.log('--- Campus Square Application-Themed Email Test ---');
console.log(`From: ${from}`);
console.log(`To: ${to}`);
if (cc) console.log(`CC: ${cc}`);
if (bcc) console.log(`BCC: ${bcc}`);
console.log('--------------------------------------------------\n');

async function run() {
  console.log('Dispatching test University Partnership enquiry...');
  const result = await sendEnquiryNotificationEmail({
    category: 'University Partnership',
    subjectTitle: 'University Partnership Enquiry: SRM Institute of Science and Technology',
    senderName: 'Dr. R. Venkatraman',
    senderEmail: 'director.admissions@srmist.edu.in',
    senderPhone: '+91 9840012345',
    organizationName: 'SRM Institute of Science and Technology',
    designation: 'Director of Admissions',
    city: 'Chennai',
    details: [
      { label: 'Category / Purpose', value: 'University Partnership' },
      { label: 'University / Institution', value: 'SRM Institute of Science and Technology' },
      { label: 'Primary Contact Person', value: 'Dr. R. Venkatraman' },
      { label: 'Official Designation', value: 'Director of Admissions' },
      { label: 'Official Email ID', value: 'director.admissions@srmist.edu.in' },
      { label: 'Phone / WhatsApp', value: '+91 9840012345' },
      { label: 'Campus City / State', value: 'Chennai, Tamil Nadu' },
      { label: 'Partnership Interest', value: 'Host interactive booth & sponsor merit scholarship sessions at Theni Edition' },
    ],
    notes: 'We are very eager to collaborate for the inaugural edition at The Little Kingdom School, Theni and subsequent Conclave editions across Tamil Nadu.',
  });

  if (result.success) {
    console.log(`\n🎉 SUCCESS! Application-themed enquiry email delivered successfully.`);
    console.log(`Message ID: ${result.messageId}`);
  } else {
    console.error('\n❌ Email Send Failed:', result.error);
  }
}

run();
