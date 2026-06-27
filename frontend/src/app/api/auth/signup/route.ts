import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDB } from '@/lib/db/data-source';
import { User } from '@/lib/db/entities/User';
import { Business } from '@/lib/db/entities/Business';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';

export const runtime = 'nodejs';

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  ownerName: z.string().min(2),
  businessName: z.string().min(2),
  phone: z.string().optional(),
  businessType: z.string().optional(),
  city: z.string().optional(),
  preferredLanguage: z.enum(['en', 'hi', 'gu']).default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);
    const db = await getDB();
    const userRepo = db.getRepository(User);
    const bizRepo = db.getRepository(Business);

    const existing = await userRepo.findOne({ where: { email: data.email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const business = await bizRepo.save({
      name: data.businessName,
      businessType: data.businessType,
      city: data.city,
      preferredLanguage: data.preferredLanguage,
      callCredits: 50, // free trial credits
      planTier: 'starter',
    });

    const passwordHash = await hashPassword(data.password);
    const user = await userRepo.save({
      email: data.email.toLowerCase(),
      passwordHash,
      ownerName: data.ownerName,
      phone: data.phone,
      role: 'owner',
      emailVerified: false,
      businessId: business.id,
    });

    const token = signToken({ userId: user.id, email: user.email, businessId: business.id });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user.id, email: user.email, ownerName: user.ownerName },
      business: { id: business.id, name: business.name, callCredits: business.callCredits, planTier: business.planTier },
    });
  } catch (e: any) {
    if (e?.issues) return NextResponse.json({ error: 'Validation failed', issues: e.issues }, { status: 400 });
    console.error(e);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
