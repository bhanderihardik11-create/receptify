import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/data-source';
import { Customer } from '@/lib/db/entities/Customer';
import { requireAuth, AuthError, unauthorizedResponse } from '@/lib/auth';
import { formatPhone, isValidIndianPhone } from '@/lib/utils';

export const runtime = 'nodejs';

interface CsvRow {
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  language?: string;
  customerType?: string;
  notes?: string;
  dueDate?: string;
  appointmentDate?: string;
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user.businessId) return NextResponse.json({ error: 'No business' }, { status: 400 });
    const { rows, dedupe = true } = (await req.json()) as { rows: CsvRow[]; dedupe?: boolean };
    if (!Array.isArray(rows)) return NextResponse.json({ error: 'rows must be array' }, { status: 400 });

    const db = await getDB();
    const repo = db.getRepository(Customer);

    const existing = await repo.find({ where: { businessId: user.businessId }, select: ['phone'] });
    const existingPhones = new Set(existing.map((c) => c.phone));

    const inserted: Customer[] = [];
    const invalid: { row: any; reason: string }[] = [];
    const duplicates: any[] = [];

    for (const row of rows) {
      if (!row.fullName || !row.phone) {
        invalid.push({ row, reason: 'Missing name or phone' });
        continue;
      }
      const phone = formatPhone(String(row.phone));
      if (!isValidIndianPhone(phone)) {
        invalid.push({ row, reason: 'Invalid Indian phone' });
        continue;
      }
      if (dedupe && existingPhones.has(phone)) {
        duplicates.push(row);
        continue;
      }
      const c = repo.create({
        businessId: user.businessId,
        fullName: String(row.fullName).trim(),
        phone,
        email: row.email && String(row.email).trim() ? String(row.email).trim() : undefined,
        city: row.city ? String(row.city).trim() : undefined,
        language: (['en', 'hi', 'gu'].includes(row.language as any) ? row.language : 'en') as any,
        customerType: row.customerType ? String(row.customerType).trim() : undefined,
        notes: row.notes ? String(row.notes).trim() : undefined,
        tags: row.customerType ? [String(row.customerType).trim()] : [],
        dueDate: row.dueDate || undefined,
        appointmentDate: row.appointmentDate || undefined,
        consentStatus: 'granted',
      });
      inserted.push(c);
      existingPhones.add(phone);
    }

    if (inserted.length) await repo.save(inserted);

    return NextResponse.json({
      insertedCount: inserted.length,
      duplicatesCount: duplicates.length,
      invalidCount: invalid.length,
      duplicates,
      invalid,
    });
  } catch (e) {
    if (e instanceof AuthError) return unauthorizedResponse();
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET() {
  const sample = `fullName,phone,email,city,language,customerType,notes,dueDate,appointmentDate
Priya Patel,9812345001,priya@example.com,Mumbai,en,patient,Annual checkup due,,2026-02-15
Rohan Mehta,9812345002,,Pune,hi,patient,Diabetes follow-up,,2026-02-18
Sneha Iyer,9812345003,sneha@example.com,Bengaluru,en,lead,Enquired about lab tests,,
`;
  return new NextResponse(sample, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="receptify-sample-customers.csv"',
    },
  });
}
