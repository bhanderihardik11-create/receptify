import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/data-source';
import { Call } from '@/lib/db/entities/Call';
import { Customer } from '@/lib/db/entities/Customer';
import { Campaign } from '@/lib/db/entities/Campaign';
import { CallTranscript } from '@/lib/db/entities/CallTranscript';
import { CallRecording } from '@/lib/db/entities/CallRecording';
import { requireAuth, AuthError, unauthorizedResponse } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const db = await getDB();

    const call = await db.getRepository(Call).findOne({ where: { id } });
    if (!call) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const customer = await db.getRepository(Customer).findOne({ where: { id: call.customerId } });
    const campaign = await db.getRepository(Campaign).findOne({ where: { id: call.campaignId } });
    if (!campaign || campaign.businessId !== user.businessId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const transcript = await db.getRepository(CallTranscript).findOne({ where: { callId: id } });
    const recording = await db.getRepository(CallRecording).findOne({ where: { callId: id } });

    return NextResponse.json({ call, customer, campaign, transcript, recording });
  } catch (e) {
    if (e instanceof AuthError) return unauthorizedResponse();
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
