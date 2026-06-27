import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/data-source';
import { Customer } from '@/lib/db/entities/Customer';
import { requireAuth, AuthError, unauthorizedResponse } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const db = await getDB();
    const c = await db.getRepository(Customer).findOne({ where: { id, businessId: user.businessId || '' } });
    if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ customer: c });
  } catch (e) {
    if (e instanceof AuthError) return unauthorizedResponse();
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const data = await req.json();
    const db = await getDB();
    const repo = db.getRepository(Customer);
    const c = await repo.findOne({ where: { id, businessId: user.businessId || '' } });
    if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    Object.assign(c, data);
    await repo.save(c);
    return NextResponse.json({ customer: c });
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
    await db.getRepository(Customer).delete({ id, businessId: user.businessId || '' });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof AuthError) return unauthorizedResponse();
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
