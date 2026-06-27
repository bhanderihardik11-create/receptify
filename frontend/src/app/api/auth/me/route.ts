import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getDB } from '@/lib/db/data-source';
import { Business } from '@/lib/db/entities/Business';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  let business = null;
  if (user.businessId) {
    const db = await getDB();
    business = await db.getRepository(Business).findOne({ where: { id: user.businessId } });
  }
  return NextResponse.json({
    user: { id: user.id, email: user.email, ownerName: user.ownerName, role: user.role, phone: user.phone },
    business: business && { id: business.id, name: business.name, businessType: business.businessType, city: business.city, callCredits: business.callCredits, planTier: business.planTier, preferredLanguage: business.preferredLanguage },
  });
}
