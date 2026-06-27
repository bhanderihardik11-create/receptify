import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDB } from '@/lib/db/data-source';
import { User } from '@/lib/db/entities/User';
import { Business } from '@/lib/db/entities/Business';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';

export const runtime = 'nodejs';

const Schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const data = Schema.parse(await req.json());
    const db = await getDB();
    const user = await db.getRepository(User).findOne({ where: { email: data.email.toLowerCase() } });
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    const ok = await comparePassword(data.password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    let business: Business | null = null;
    if (user.businessId) {
      business = await db.getRepository(Business).findOne({ where: { id: user.businessId } });
    }

    const token = signToken({ userId: user.id, email: user.email, businessId: user.businessId || null });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user.id, email: user.email, ownerName: user.ownerName },
      business: business ? { id: business.id, name: business.name, callCredits: business.callCredits, planTier: business.planTier } : null,
    });
  } catch (e: any) {
    if (e?.issues) return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
