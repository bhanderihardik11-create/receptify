import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import bcrypt from 'bcryptjs';
import AppDataSource from './data-source';
import { User } from './entities/User';
import { Business } from './entities/Business';
import { Customer } from './entities/Customer';
import { Template } from './entities/Template';
import { BillingPlan } from './entities/BillingPlan';

async function main() {
  await AppDataSource.initialize();
  console.log('DB initialized');

  // Run migrations
  await AppDataSource.runMigrations();
  console.log('Migrations applied');

  const userRepo = AppDataSource.getRepository(User);
  const bizRepo = AppDataSource.getRepository(Business);
  const custRepo = AppDataSource.getRepository(Customer);
  const tmplRepo = AppDataSource.getRepository(Template);
  const planRepo = AppDataSource.getRepository(BillingPlan);

  // Seed billing plans
  const planCount = await planRepo.count();
  if (planCount === 0) {
    await planRepo.save([
      { name: 'Starter', tier: 'starter', monthlyCalls: 250, monthlyPrice: 999, features: ['250 monthly call credits', 'AI script generation', 'CSV upload', 'Call dashboard'] },
      { name: 'Growth', tier: 'growth', monthlyCalls: 2000, monthlyPrice: 4999, features: ['2000 monthly call credits', 'Recordings & transcripts', 'Multi-language scripts', 'Priority email support', 'Campaign templates'] },
      { name: 'Business', tier: 'business', monthlyCalls: 10000, monthlyPrice: 19999, features: ['10000 monthly call credits', 'Team members', 'Advanced analytics', 'Priority phone support', 'Custom voice training'] },
    ]);
    console.log('Billing plans seeded');
  }

  // Seed templates
  const tmplCount = await tmplRepo.count();
  if (tmplCount === 0) {
    await tmplRepo.save([
      { name: 'NBFC EMI Reminder', industry: 'NBFC / Finance', purpose: 'payment_reminder', language: 'en', preview: 'Polite EMI reminder for upcoming due date.', body: 'Hello {{name}}, this is a friendly reminder from {{business}}. Your EMI of ₹{{amount}} is due on {{due_date}}. Please pay on time to avoid late fees. Thank you!' },
      { name: 'Clinic Appointment Reminder', industry: 'Clinic / Healthcare', purpose: 'appointment_reminder', language: 'en', preview: 'Reminder for upcoming appointment with doctor.', body: 'Hello {{name}}, this is {{business}}. Your appointment with the doctor is scheduled on {{date}} at {{time}}. Please arrive 10 minutes early. Reply or call us if you need to reschedule.' },
      { name: 'Real Estate Lead Follow-up', industry: 'Real Estate', purpose: 'lead_followup', language: 'en', preview: 'Following up on property enquiry.', body: 'Hi {{name}}, this is {{business}}. You enquired about a property recently. We have new options matching your needs. Can we schedule a site visit this week?' },
      { name: 'Coaching Admission Follow-up', industry: 'Coaching / Ed-tech', purpose: 'lead_followup', language: 'en', preview: 'Follow up with prospective students.', body: 'Hello {{name}}, this is {{business}}. Just following up on the admission enquiry. Our next batch starts on {{date}}. Would you like to confirm your seat today?' },
      { name: 'Gym Membership Renewal', industry: 'Gym / Fitness', purpose: 'renewal_reminder', language: 'en', preview: 'Membership expiry reminder.', body: 'Hi {{name}}, this is {{business}}. Your gym membership expires on {{date}}. Renew today to continue your fitness journey and unlock our renewal discount.' },
      { name: 'Diagnostic Lab Report Ready', industry: 'Diagnostic Lab', purpose: 'appointment_reminder', language: 'en', preview: 'Notify customers their reports are ready.', body: 'Hello {{name}}, this is {{business}}. Your diagnostic report is ready. You can collect it at the lab or we can email it to {{email}}.' },
      { name: 'D2C COD Confirmation', industry: 'D2C Brand', purpose: 'cod_confirmation', language: 'en', preview: 'Confirm COD order before dispatch.', body: 'Hi {{name}}, this is {{business}}. We are dispatching your COD order #{{order_id}} worth ₹{{amount}}. Please confirm if you would like us to proceed.' },
      { name: 'Service Renewal Reminder', industry: 'Local Service Business', purpose: 'service_renewal', language: 'en', preview: 'Reminder for annual service renewal.', body: 'Hello {{name}}, this is {{business}}. Your annual service is due for renewal on {{date}}. Shall we book a service appointment for you?' },
      { name: 'NBFC EMI Reminder (Hindi)', industry: 'NBFC / Finance', purpose: 'payment_reminder', language: 'hi', preview: 'Hindi EMI reminder.', body: 'Namaste {{name}}, yeh {{business}} se reminder hai. Aapki EMI ₹{{amount}} {{due_date}} ko due hai. Kripya samay par bhugtan karein. Dhanyavaad!' },
    ]);
    console.log('Templates seeded');
  }

  // Seed demo user + business
  const demoEmail = 'demo@receptify.in';
  let demoUser = await userRepo.findOne({ where: { email: demoEmail } });
  if (!demoUser) {
    const business = await bizRepo.save({
      name: 'Demo Clinic & Diagnostics',
      businessType: 'Clinic / Healthcare',
      city: 'Mumbai',
      preferredLanguage: 'en',
      isVerified: true,
      callCredits: 1000,
      planTier: 'growth',
    });
    const passwordHash = await bcrypt.hash('Demo@1234', 10);
    demoUser = await userRepo.save({
      email: demoEmail,
      passwordHash,
      ownerName: 'Aarav Sharma',
      phone: '+919876543210',
      role: 'owner',
      emailVerified: true,
      businessId: business.id,
    });
    console.log(`Demo user seeded: ${demoEmail} / Demo@1234`);

    // Seed customers
    const customers = [
      { fullName: 'Priya Patel', phone: '+919812345001', city: 'Mumbai', language: 'en' as const, customerType: 'patient', notes: 'Annual checkup due', consentStatus: 'granted' as const, appointmentDate: '2026-02-15' },
      { fullName: 'Rohan Mehta', phone: '+919812345002', city: 'Pune', language: 'hi' as const, customerType: 'patient', notes: 'Diabetes follow-up', consentStatus: 'granted' as const, appointmentDate: '2026-02-18' },
      { fullName: 'Sneha Iyer', phone: '+919812345003', city: 'Bengaluru', language: 'en' as const, customerType: 'lead', notes: 'Enquired about lab tests', consentStatus: 'granted' as const },
      { fullName: 'Vikram Singh', phone: '+919812345004', city: 'Delhi', language: 'hi' as const, customerType: 'patient', notes: 'Report ready for collection', consentStatus: 'granted' as const },
      { fullName: 'Ananya Reddy', phone: '+919812345005', city: 'Hyderabad', language: 'en' as const, customerType: 'patient', notes: 'BP medication refill', consentStatus: 'granted' as const, dueDate: '2026-02-20' },
      { fullName: 'Aditya Kapoor', phone: '+919812345006', city: 'Mumbai', language: 'en' as const, customerType: 'lead', notes: 'Wants pricing for full body checkup', consentStatus: 'pending' as const },
      { fullName: 'Meera Joshi', phone: '+919812345007', city: 'Ahmedabad', language: 'gu' as const, customerType: 'patient', notes: 'Post-surgery follow-up', consentStatus: 'granted' as const, appointmentDate: '2026-02-25' },
      { fullName: 'Karan Malhotra', phone: '+919812345008', city: 'Delhi', language: 'en' as const, customerType: 'patient', notes: 'Annual subscription due', consentStatus: 'granted' as const, dueDate: '2026-03-01' },
      { fullName: 'Pooja Desai', phone: '+919812345009', city: 'Surat', language: 'gu' as const, customerType: 'patient', notes: 'Reminder for vaccination', consentStatus: 'granted' as const, appointmentDate: '2026-02-22' },
      { fullName: 'Rahul Verma', phone: '+919812345010', city: 'Mumbai', language: 'en' as const, customerType: 'lead', notes: 'Family checkup package interest', consentStatus: 'granted' as const },
    ];
    for (const c of customers) {
      await custRepo.save({ ...c, businessId: business.id, tags: [c.customerType || 'customer'] });
    }
    console.log(`Seeded ${customers.length} demo customers`);
  } else {
    console.log('Demo user already exists');
  }

  console.log('Seed complete.');
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
