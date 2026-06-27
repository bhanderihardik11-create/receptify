import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/data-source';
import { Campaign } from '@/lib/db/entities/Campaign';
import { requireAuth, AuthError, unauthorizedResponse } from '@/lib/auth';
import { startCampaign } from '@/lib/calling-mock';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const db = await getDB();
    const campRepo = db.getRepository(Campaign);
    const camp = await campRepo.findOne({ where: { id, businessId: user.businessId || '' } });
    if (!camp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!camp.complianceConfirmed) {
      return NextResponse.json({ error: 'Compliance confirmation required before launch' }, { status: 400 });
    }
    if (camp.status === 'running') {
      return NextResponse.json({ campaign: camp, alreadyRunning: true });
    }
    // Start the mock engine (fire-and-forget)
    await startCampaign(id);
    const updated = await campRepo.findOne({ where: { id } });
    return NextResponse.json({ campaign: updated });
  } catch (e: any) {
    if (e instanceof AuthError) return unauthorizedResponse();
    console.error(e);
    return NextResponse.json({ error: e.message || 'Launch failed' }, { status: 500 });
  }
}
