import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDB } from '@/lib/db/data-source';
import { Campaign } from '@/lib/db/entities/Campaign';
import { CampaignCustomer } from '@/lib/db/entities/CampaignCustomer';
import { requireAuth, AuthError, unauthorizedResponse } from '@/lib/auth';

export const runtime = 'nodejs';

const CreateSchema = z.object({
  name: z.string().min(2),
  purpose: z.string(),
  language: z.enum(['en', 'hi', 'gu']).default('en'),
  voiceType: z.string().default('female_professional'),
  scriptText: z.string().optional(),
  customerIds: z.array(z.string().uuid()).default([]),
  scheduledAt: z.string().optional(),
  callingWindowStart: z.string().default('09:00'),
  callingWindowEnd: z.string().default('19:00'),
  retryAttempts: z.number().int().min(0).max(5).default(2),
  delayBetweenCalls: z.number().int().min(1).max(60).default(5),
  complianceConfirmed: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const db = await getDB();
    const camps = await db.getRepository(Campaign).find({
      where: { businessId: user.businessId || '' },
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json({ campaigns: camps });
  } catch (e) {
    if (e instanceof AuthError) return unauthorizedResponse();
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user.businessId) return NextResponse.json({ error: 'No business' }, { status: 400 });
    const data = CreateSchema.parse(await req.json());
    const db = await getDB();
    const campRepo = db.getRepository(Campaign);
    const ccRepo = db.getRepository(CampaignCustomer);

    const camp = await campRepo.save({
      businessId: user.businessId,
      name: data.name,
      purpose: data.purpose as any,
      language: data.language,
      voiceType: data.voiceType,
      scriptText: data.scriptText,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      callingWindowStart: data.callingWindowStart,
      callingWindowEnd: data.callingWindowEnd,
      retryAttempts: data.retryAttempts,
      delayBetweenCalls: data.delayBetweenCalls,
      complianceConfirmed: data.complianceConfirmed,
      totalContacts: data.customerIds.length,
      status: 'draft',
    });

    if (data.customerIds.length) {
      const ccs = data.customerIds.map((cid) => ccRepo.create({ campaignId: camp.id, customerId: cid }));
      await ccRepo.save(ccs);
    }

    return NextResponse.json({ campaign: camp });
  } catch (e: any) {
    if (e instanceof AuthError) return unauthorizedResponse();
    if (e?.issues) return NextResponse.json({ error: 'Validation failed', issues: e.issues }, { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
