import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { getDailyRegistrationSummary } from '../src/lib/daily-summary';
import { sendDailyRegistrationSummaryEmail, getFromEmailAddress } from '../src/lib/email';

async function main() {
  console.log('====================================================');
  console.log('   Campus Square™ Daily Summary Report Generator    ');
  console.log('====================================================\n');

  const from = getFromEmailAddress();
  const to = process.env.DAILY_SUMMARY_RECIPIENT_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ENQUIRY_NOTIFICATION_EMAIL || 'interact@atom-infinity.com';

  console.log(`From Sender: ${from}`);
  console.log(`Primary Recipient: ${to}`);
  if (process.env.DAILY_SUMMARY_CC) console.log(`CC: ${process.env.DAILY_SUMMARY_CC}`);
  if (process.env.DAILY_SUMMARY_BCC) console.log(`BCC: ${process.env.DAILY_SUMMARY_BCC}`);
  console.log('----------------------------------------------------\n');

  console.log('1. Fetching previous day registration data across all editions...');
  const summary = await getDailyRegistrationSummary();

  console.log(`\nReport Target Date : ${summary.reportDateFormatted}`);
  console.log(`Reporting Period   : ${summary.periodStartFormatted} – ${summary.periodEndFormatted}`);
  console.log(`Generated At       : ${summary.generatedAtFormatted}\n`);

  console.log('📊 Key Metrics:');
  console.log(` - Yesterday's Registrations : +${summary.totalYesterdayRegistrations}`);
  console.log(`   └─ Students  : ${summary.totalYesterdayStudents}`);
  console.log(`   └─ Parents   : ${summary.totalYesterdayParents}`);
  console.log(`   └─ Educators : ${summary.totalYesterdayEducators}`);
  console.log(`   └─ Others    : ${summary.totalYesterdayOthers}`);
  console.log(` - Cumulative All-Time Total : ${summary.totalCumulativeRegistrations}`);
  console.log(` - Active Fair Editions      : ${summary.totalActiveEditions}`);
  console.log(` - OriginBI Assessments Val. : ₹${summary.totalAssessmentsValueYesterday.toLocaleString('en-IN')}\n`);

  console.log('🏙️  Editions Breakdown:');
  summary.editions.forEach(ed => {
    console.log(` - [${ed.city} Edition] ${ed.title}`);
    console.log(`   Status: ${ed.displayStatus} | Date: ${ed.isDateTba ? 'TBA' : (ed.startDate ? ed.startDate.toISOString().split('T')[0] : 'N/A')}`);
    console.log(`   Yesterday: +${ed.yesterdayTotal} | Total: ${ed.cumulativeTotal} (Capacity: ${ed.maxCapacity || 'Unlimited'})`);
    if (ed.yesterdayParticipants.length > 0) {
      console.log(`   Latest Yesterday Signups (${ed.yesterdayParticipants.length}):`);
      ed.yesterdayParticipants.slice(0, 3).forEach(p => {
        console.log(`     • ${p.timeFormatted} - ${p.fullName} (${p.category})`);
      });
    }
  });

  const isDryRun = process.argv.includes('--dry-run');

  if (isDryRun) {
    console.log('\n[Dry-run Mode] Email dispatch skipped.');
    process.exit(0);
  }

  console.log('\n2. Dispatching executive daily summary email...');
  const res = await sendDailyRegistrationSummaryEmail(summary);

  if (res.success) {
    console.log(`\n🎉 SUCCESS! Daily registration summary email delivered successfully.`);
    console.log(`Message ID: ${res.messageId}`);
  } else {
    console.error(`\n❌ Failed to deliver summary email:`, res.error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
