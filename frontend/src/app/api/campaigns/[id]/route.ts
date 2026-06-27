import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/data-source';
import { Campaign } from '@/lib/db/entities/Campaign';
import { CampaignCustomer } from '@/lib/db/entities/CampaignCustomer';
import { Customer } from '@/lib/db/entities/Customer';
import { Call } from '@/lib/db/entities/Call';
import { requireAuth, AuthError, unauthorizedResponse } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const db = await getDB();
    const camp = await db.getRepository(Campaign).findOne({ where: { id, businessId: user.businessId || '' } });
    if (!camp) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const ccs = await db.getRepository(CampaignCustomer).find({ where: { campaignId: id } });
    const custIds = ccs.map((c) => c.customerId);
    const customers = custIds.length
      ? await db.getRepository(Customer).createQueryBuilder('c').where('c.id IN (:...ids)', { ids: custIds }).getMany()
      : [];

    const calls = await db.getRepository(Call).find({ where: { campaignId: id }, order: { createdAt: 'DESC' } });

    return NextResponse.json({ campaign: camp, customers, calls });
  } catch (e) {
    if (e instanceof AuthError) return unauthorizedResponse();
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const db = await getDB();
    await db.getRepository(Campaign).delete({ id, businessId: user.businessId || '' });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof AuthError) return unauthorizedResponse();
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
