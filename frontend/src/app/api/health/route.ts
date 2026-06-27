import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/data-source';
export const runtime = 'nodejs';
export async function GET() {
  try {
    await getDB();
    return NextResponse.json({ status: 'ok' });
  } catch (e: any) {
    return NextResponse.json({ status: 'db_error', error: e?.message }, { status: 500 });
  }
}
