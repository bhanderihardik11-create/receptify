/**
 * Mock calling engine — simulates an AI calling campaign.
 *
 * In production, this would be replaced with real integrations
 * (Twilio + ElevenLabs / OpenAI TTS / Vapi / Bolna etc.).
 *
 * The mock:
 *  - Creates Call rows for each customer in the campaign
 *  - Progressively updates call statuses (queued -> ringing -> in_progress -> completed/failed/no_answer)
 *  - Generates a realistic random outcome
 *  - Creates a transcript + recording placeholder
 *  - Updates campaign aggregates
 */

import { getDB } from './db/data-source';
import { Campaign } from './db/entities/Campaign';
import { CampaignCustomer } from './db/entities/CampaignCustomer';
import { Call, CallOutcome, CallStatus } from './db/entities/Call';
import { CallTranscript } from './db/entities/CallTranscript';
import { CallRecording } from './db/entities/CallRecording';
import { Customer } from './db/entities/Customer';

// In-memory map of running campaigns so we don't double-start
const running = new Set<string>();

const OUTCOMES: { outcome: CallOutcome; status: CallStatus; weight: number }[] = [
  { outcome: 'interested', status: 'completed', weight: 18 },
  { outcome: 'callback_requested', status: 'completed', weight: 14 },
  { outcome: 'payment_promised', status: 'completed', weight: 10 },
  { outcome: 'appointment_confirmed', status: 'completed', weight: 12 },
  { outcome: 'not_interested', status: 'completed', weight: 12 },
  { outcome: 'no_answer', status: 'no_answer', weight: 18 },
  { outcome: 'wrong_number', status: 'failed', weight: 6 },
  { outcome: 'failed', status: 'failed', weight: 10 },
];

function pickOutcome() {
  const total = OUTCOMES.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of OUTCOMES) {
    r -= o.weight;
    if (r <= 0) return o;
  }
  return OUTCOMES[0];
}

function mockTranscript(customerName: string, business: string, purpose: string, language: string, outcome: CallOutcome): string {
  const intro = language === 'hi'
    ? `AI: Namaste ${customerName} ji, main ${business} se baat kar raha hoon.\nCustomer: Haan, boliye.`
    : language === 'gu'
      ? `AI: Namaste ${customerName}, hu ${business} thi vaat karu chu.\nCustomer: Haan, kahevu chhu.`
      : `AI: Hello ${customerName}, this is a call from ${business}.\nCustomer: Yes, please go ahead.`;

  const purposeLine = {
    payment_reminder: 'AI: This is a gentle reminder regarding your upcoming payment due soon.',
    appointment_reminder: 'AI: I am calling to remind you about your upcoming appointment with us.',
    lead_followup: 'AI: You had enquired with us recently. I wanted to follow up.',
    feedback: 'AI: We would love to get your quick feedback on our service.',
    event_reminder: 'AI: This is a reminder for the upcoming event you registered for.',
    service_renewal: 'AI: Your service is up for renewal soon — wanted to share the renewal details.',
    cod_confirmation: 'AI: I am calling to confirm your COD order before we dispatch.',
    renewal_reminder: 'AI: Your subscription is due for renewal — want to confirm if you would like to continue.',
    reactivation: 'AI: We noticed you have been away for a while — we have something special for you.',
    custom: 'AI: I am calling to share important information with you.',
  }[purpose] || '';

  const outcomeReply = {
    interested: 'Customer: Yes, I am interested. Please send the details.',
    callback_requested: 'Customer: I am busy right now, please call back later.',
    payment_promised: 'Customer: I will make the payment by tomorrow.',
    appointment_confirmed: 'Customer: Yes, I will be there at the scheduled time.',
    not_interested: 'Customer: Thank you, but I am not interested right now.',
    no_answer: '(No response — call dropped.)',
    wrong_number: 'Customer: You have the wrong number.',
    failed: '(Call could not connect.)',
    pending: '',
  }[outcome] || '';

  const closing = 'AI: Thank you for your time. Have a great day!';

  return `${intro}\n${purposeLine}\n${outcomeReply}\n${closing}`;
}

function mockSummary(outcome: CallOutcome): string {
  const map: Record<CallOutcome, string> = {
    interested: 'Customer expressed clear interest. Recommend follow-up with detailed offer.',
    callback_requested: 'Customer requested a callback. Schedule for later today.',
    payment_promised: 'Customer committed to payment by next working day.',
    appointment_confirmed: 'Appointment confirmed by customer.',
    not_interested: 'Customer declined politely. No follow-up needed.',
    no_answer: 'No response from customer. Retry as per campaign policy.',
    wrong_number: 'Number does not belong to the intended customer. Update CRM.',
    failed: 'Call could not be connected due to network or carrier issue.',
    pending: 'Call pending.',
  };
  return map[outcome];
}

export async function startCampaign(campaignId: string): Promise<void> {
  if (running.has(campaignId)) return;
  running.add(campaignId);

  const db = await getDB();
  const campRepo = db.getRepository(Campaign);
  const ccRepo = db.getRepository(CampaignCustomer);
  const callRepo = db.getRepository(Call);
  const tRepo = db.getRepository(CallTranscript);
  const rRepo = db.getRepository(CallRecording);

  const campaign = await campRepo.findOne({ where: { id: campaignId } });
  if (!campaign) {
    running.delete(campaignId);
    return;
  }

  const ccs = await ccRepo.find({ where: { campaignId } });

  campaign.status = 'running';
  campaign.totalContacts = ccs.length;
  campaign.callsCompleted = 0;
  campaign.callsAnswered = 0;
  campaign.callsFailed = 0;
  await campRepo.save(campaign);

  // Create Call rows for all customers (queued)
  const calls: Call[] = [];
  for (const cc of ccs) {
    const call = callRepo.create({
      campaignId: cc.campaignId,
      customerId: cc.customerId,
      status: 'queued',
      outcome: 'pending',
      attemptNumber: 1,
    });
    calls.push(call);
  }
  const savedCalls = await callRepo.save(calls);

  // Run async without awaiting
  void (async () => {
    try {
      const custRepo = db.getRepository(Customer);
      for (const call of savedCalls) {
        // ringing
        call.status = 'ringing';
        call.startedAt = new Date();
        await callRepo.save(call);
        await sleep(400 + Math.random() * 400);

        // outcome decision
        const choice = pickOutcome();
        call.status = 'in_progress';
        await callRepo.save(call);
        await sleep(500 + Math.random() * 800);

        const duration = choice.status === 'completed' ? 35 + Math.floor(Math.random() * 90) :
                         choice.status === 'no_answer' ? 5 + Math.floor(Math.random() * 10) :
                         3 + Math.floor(Math.random() * 6);
        call.durationSec = duration;
        call.outcome = choice.outcome;
        call.status = choice.status;
        call.endedAt = new Date();
        await callRepo.save(call);

        // Transcript + recording for completed calls
        if (choice.status === 'completed') {
          const customer = await custRepo.findOne({ where: { id: call.customerId } });
          if (customer) {
            const freshCamp = await campRepo.findOne({ where: { id: campaignId } });
            const txt = mockTranscript(customer.fullName, freshCamp?.business?.name || 'our team', campaign.purpose, campaign.language, choice.outcome);
            await tRepo.save({ callId: call.id, text: txt, summary: mockSummary(choice.outcome) });
            await rRepo.save({ callId: call.id, audioUrl: '/audio/sample-recording.wav', durationSec: duration });
          }
        }

        // Update campaign aggregates
        const freshCamp = await campRepo.findOne({ where: { id: campaignId } });
        if (freshCamp) {
          freshCamp.callsCompleted += 1;
          if (choice.status === 'completed') freshCamp.callsAnswered += 1;
          if (choice.status === 'failed') freshCamp.callsFailed += 1;
          if (freshCamp.callsCompleted >= freshCamp.totalContacts) {
            freshCamp.status = 'completed';
          }
          await campRepo.save(freshCamp);
        }

        await sleep(200);
      }
    } finally {
      running.delete(campaignId);
    }
  })();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
