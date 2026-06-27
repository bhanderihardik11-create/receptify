import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/data-source';
import { Call } from '@/lib/db/entities/Call';
import { Campaign } from '@/lib/db/entities/Campaign';
import { Customer } from '@/lib/db/entities/Customer';
import { CallTranscript } from '@/lib/db/entities/CallTranscript';
import { CallRecording } from '@/lib/db/entities/CallRecording';
import { requireAuth, AuthError, unauthorizedResponse } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user.businessId) return NextResponse.json({ calls: [] });
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const outcome = url.searchParams.get('outcome');
    const campaignId = url.searchParams.get('campaignId');

    const db = await getDB();
    let qb = db.getRepository(Call).createQueryBuilder('call')
      .innerJoin(Campaign, 'camp', 'camp.id = call."campaignId"')
      .leftJoinAndMapOne('call.customer', Customer, 'cust', 'cust.id = call."customerId"')
      .leftJoinAndMapOne('call.campaign', Campaign, 'c', 'c.id = call."campaignId"')
      .where('camp."businessId" = :biz', { biz: user.businessId });

    if (status) qb = qb.andWhere('call.status = :status', { status });
    if (outcome) qb = qb.andWhere('call.outcome = :outcome', { outcome });
    if (campaignId) qb = qb.andWhere('call."campaignId" = :cid', { cid: campaignId });

    qb = qb.orderBy('call."createdAt"', 'DESC').limit(500);

    const calls = await qb.getMany();
    return NextResponse.json({ calls });
  } catch (e) {
    if (e instanceof AuthError) return unauthorizedResponse();
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
