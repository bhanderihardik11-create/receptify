import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDB } from '@/lib/db/data-source';
import { Customer } from '@/lib/db/entities/Customer';
import { requireAuth, AuthError, unauthorizedResponse } from '@/lib/auth';
import { formatPhone, isValidIndianPhone } from '@/lib/utils';
import { ILike } from 'typeorm';

export const runtime = 'nodejs';

const CreateSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().optional(),
  language: z.enum(['en', 'hi', 'gu']).default('en'),
  customerType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  appointmentDate: z.string().optional(),
  notes: z.string().optional(),
  consentStatus: z.enum(['pending', 'granted', 'revoked']).default('granted'),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user.businessId) return NextResponse.json({ customers: [], total: 0 });
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const tag = url.searchParams.get('tag') || '';
    const db = await getDB();
    const where: any = { businessId: user.businessId };
    const repo = db.getRepository(Customer);

    let qb = repo.createQueryBuilder('c').where('c."businessId" = :biz', { biz: user.businessId });
    if (q) qb = qb.andWhere('(c."fullName" ILIKE :q OR c.phone ILIKE :q OR c.city ILIKE :q)', { q: `%${q}%` });
    if (tag) qb = qb.andWhere('c.tags LIKE :tag', { tag: `%${tag}%` });
    qb = qb.orderBy('c."createdAt"', 'DESC').limit(500);
    const customers = await qb.getMany();
    return NextResponse.json({ customers, total: customers.length });
  } catch (e: any) {
    if (e instanceof AuthError) return unauthorizedResponse();
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user.businessId) return NextResponse.json({ error: 'No business' }, { status: 400 });
    const body = await req.json();
    const data = CreateSchema.parse(body);
    const phone = formatPhone(data.phone);
    if (!isValidIndianPhone(phone)) {
      return NextResponse.json({ error: 'Invalid Indian phone number' }, { status: 400 });
    }
    const db = await getDB();
    const repo = db.getRepository(Customer);
    const c = await repo.save({
      businessId: user.businessId,
      fullName: data.fullName,
      phone,
      email: data.email || undefined,
      city: data.city,
      language: data.language,
      customerType: data.customerType,
      tags: data.tags || [],
      dueDate: data.dueDate,
      appointmentDate: data.appointmentDate,
      notes: data.notes,
      consentStatus: data.consentStatus,
    });
    return NextResponse.json({ customer: c });
  } catch (e: any) {
    if (e instanceof AuthError) return unauthorizedResponse();
    if (e?.issues) return NextResponse.json({ error: 'Validation failed', issues: e.issues }, { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
