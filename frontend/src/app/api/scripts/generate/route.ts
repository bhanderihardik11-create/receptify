import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Proxies script generation to the FastAPI LLM endpoint (Claude Sonnet 4.5)
const LLM_URL = process.env.LLM_SERVICE_URL || 'http://localhost:8001';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${LLM_URL}/api/llm/generate-script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (e: any) {
    console.error('Script generation error', e);
    return NextResponse.json({ error: 'LLM unavailable' }, { status: 500 });
  }
}
