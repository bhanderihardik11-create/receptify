import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/data-source';
import { Template } from '@/lib/db/entities/Template';

export const runtime = 'nodejs';

export async function GET() {
  const db = await getDB();
  const templates = await db.getRepository(Template).find({ order: { industry: 'ASC' } });
  return NextResponse.json({ templates });
}
