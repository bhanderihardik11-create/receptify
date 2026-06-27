import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/data-source';
import { Customer } from '@/lib/db/entities/Customer';
import { Campaign } from '@/lib/db/entities/Campaign';
import { Call } from '@/lib/db/entities/Call';
import { requireAuth, AuthError, unauthorizedResponse } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user.businessId) return NextResponse.json({ summary: null });
    const db = await getDB();
    const biz = user.businessId;

    const [totalCustomers, totalCampaigns, totalCalls, answered, failed, callbacks, callsByDay, outcomes] = await Promise.all([
      db.getRepository(Customer).countBy({ businessId: biz }),
      db.getRepository(Campaign).countBy({ businessId: biz }),
      db.getRepository(Call).createQueryBuilder('c').innerJoin(Campaign, 'camp', 'camp.id = c."campaignId"').where('camp."businessId" = :biz', { biz }).getCount(),
      db.getRepository(Call).createQueryBuilder('c').innerJoin(Campaign, 'camp', 'camp.id = c."campaignId"').where('camp."businessId" = :biz', { biz }).andWhere('c.status = :s', { s: 'completed' }).getCount(),
      db.getRepository(Call).createQueryBuilder('c').innerJoin(Campaign, 'camp', 'camp.id = c."campaignId"').where('camp."businessId" = :biz', { biz }).andWhere('c.status = :s', { s: 'failed' }).getCount(),
      db.getRepository(Call).createQueryBuilder('c').innerJoin(Campaign, 'camp', 'camp.id = c."campaignId"').where('camp."businessId" = :biz', { biz }).andWhere('c.outcome = :o', { o: 'callback_requested' }).getCount(),
      db.getRepository(Call).createQueryBuilder('c')
        .select(`to_char(c."createdAt", 'Mon DD')`, 'day')
        .addSelect(`COUNT(*)`, 'count')
        .innerJoin(Campaign, 'camp', 'camp.id = c."campaignId"')
        .where('camp."businessId" = :biz', { biz })
        .andWhere(`c."createdAt" > now() - interval '14 days'`)
        .groupBy('day')
        .orderBy('MIN(c."createdAt")', 'ASC')
        .getRawMany(),
      db.getRepository(Call).createQueryBuilder('c')
        .select('c.outcome', 'outcome')
        .addSelect('COUNT(*)', 'count')
        .innerJoin(Campaign, 'camp', 'camp.id = c."campaignId"')
        .where('camp."businessId" = :biz', { biz })
        .groupBy('c.outcome')
        .getRawMany(),
    ]);

    const recentCampaigns = await db.getRepository(Campaign).find({ where: { businessId: biz }, order: { createdAt: 'DESC' }, take: 5 });
    const recentCalls = await db.getRepository(Call).createQueryBuilder('c')
      .innerJoin(Campaign, 'camp', 'camp.id = c."campaignId"')
      .leftJoinAndMapOne('c.customer', Customer, 'cust', 'cust.id = c."customerId"')
      .leftJoinAndMapOne('c.campaign', Campaign, 'campm', 'campm.id = c."campaignId"')
      .where('camp."businessId" = :biz', { biz })
      .orderBy('c."createdAt"', 'DESC')
      .limit(8)
      .getMany();

    return NextResponse.json({
      totals: { totalCustomers, totalCampaigns, totalCalls, answered, failed, callbacks },
      answerRate: totalCalls ? Math.round((answered / totalCalls) * 100) : 0,
      callbackRate: totalCalls ? Math.round((callbacks / totalCalls) * 100) : 0,
      failedRate: totalCalls ? Math.round((failed / totalCalls) * 100) : 0,
      callsByDay: callsByDay.map((r: any) => ({ day: r.day, count: parseInt(r.count, 10) })),
      outcomes: outcomes.map((r: any) => ({ outcome: r.outcome, count: parseInt(r.count, 10) })),
      recentCampaigns,
      recentCalls,
    });
  } catch (e) {
    if (e instanceof AuthError) return unauthorizedResponse();
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
