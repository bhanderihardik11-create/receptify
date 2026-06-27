"""
Receptify backend (port 8001).

Responsibilities:
1. Direct LLM endpoints: POST /api/llm/generate-script, /api/llm/generate-summary
   - Calls Claude Sonnet 4.5 via emergentintegrations (Emergent Universal Key)
2. Reverse-proxy ALL other /api/* requests to the Next.js app on localhost:3000
   where TypeORM + Postgres handlers live. This satisfies the Kubernetes
   ingress rule (/api/* -> 8001) while letting Next.js own the data layer.
"""

import os
import asyncio
import logging
from typing import Optional, Literal

from dotenv import load_dotenv
load_dotenv()

import httpx
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from emergentintegrations.llm.chat import LlmChat, UserMessage

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
NEXT_INTERNAL_URL = os.environ.get("NEXT_INTERNAL_URL", "http://localhost:3000")
ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929"

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("receptify")

app = FastAPI(title="Receptify Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------- LLM Endpoints -------------------

class GenerateScriptRequest(BaseModel):
    purpose: str = Field(..., description="payment_reminder, appointment_reminder, lead_followup, etc.")
    business_name: str
    business_type: Optional[str] = None
    customer_type: Optional[str] = None
    language: Literal["en", "hi", "gu"] = "en"
    tone: Literal["professional", "friendly", "polite"] = "professional"
    call_goal: Optional[str] = None
    important_details: Optional[str] = None
    cta: Optional[str] = None


class GenerateScriptResponse(BaseModel):
    opening: str
    main_message: str
    response_handling: str
    closing: str
    cta: str
    short_version: str
    polite_version: str
    professional_version: str
    full_script: str


SCRIPT_SYSTEM_PROMPT = """You are an expert AI script writer for Indian small businesses generating professional customer calling scripts. You write scripts that are:
- Polite, respectful, compliance-aware, never spammy
- Short (under 45 seconds when spoken)
- Use simple, conversational language
- Use {{name}} placeholder for customer name and {{business}} for the business name
- Suitable for an AI voice agent to read out
- Culturally appropriate for India (use namaste/hello, ji where natural)

You MUST return a strict JSON object with these keys (no markdown, no preamble):
{
  "opening": "1-2 sentence greeting + identify business",
  "main_message": "2-4 sentences explaining the purpose of the call",
  "response_handling": "1-2 short sentences on how the AI agent should handle a customer reply",
  "closing": "1-2 sentence polite sign-off",
  "cta": "Clear single-line call to action",
  "short_version": "Very short (under 20 sec) version of the full script",
  "polite_version": "Maximum politeness variant of the full script",
  "professional_version": "Formal/professional variant of the full script",
  "full_script": "The complete script combining opening + main_message + closing"
}
The language of all content must match the requested language (English / Hindi / Gujarati). For Hindi/Gujarati, write in transliterated Roman script (e.g., \"Namaste\")."""


def _build_user_prompt(req: GenerateScriptRequest) -> str:
    purpose_human = req.purpose.replace("_", " ")
    parts = [
        f"Purpose: {purpose_human}",
        f"Business name: {req.business_name}",
    ]
    if req.business_type:
        parts.append(f"Business type / industry: {req.business_type}")
    if req.customer_type:
        parts.append(f"Customer type: {req.customer_type}")
    parts.append(f"Language: {req.language}")
    parts.append(f"Tone: {req.tone}")
    if req.call_goal:
        parts.append(f"Call goal: {req.call_goal}")
    if req.important_details:
        parts.append(f"Important details to include: {req.important_details}")
    if req.cta:
        parts.append(f"Desired CTA: {req.cta}")
    parts.append("\nGenerate the script now. Return ONLY JSON, no other text.")
    return "\n".join(parts)


def _fallback_script(req: GenerateScriptRequest) -> GenerateScriptResponse:
    """Used if Claude is unreachable — keeps the app functional."""
    purpose = req.purpose.replace("_", " ")
    opening = f"Namaste {{{{name}}}}, this is {{{{business}}}} calling regarding your {purpose}."
    main = f"We wanted to share an important update with you about your {purpose}. Could you please give us a moment?"
    handling = "If the customer is busy, politely offer to call back at a convenient time."
    closing = "Thank you for your time. Have a wonderful day!"
    cta_line = req.cta or "Please reply to confirm or call us back at your convenience."
    full = f"{opening} {main} {cta_line} {closing}"
    return GenerateScriptResponse(
        opening=opening, main_message=main, response_handling=handling,
        closing=closing, cta=cta_line,
        short_version=f"{opening} {cta_line} Thank you!",
        polite_version=f"{opening} Hope this is a good time. {main} {cta_line} Thank you so much for your time!",
        professional_version=f"{opening} {main} {cta_line} Regards, {{{{business}}}} team.",
        full_script=full,
    )


@app.post("/api/llm/generate-script", response_model=GenerateScriptResponse)
async def generate_script(req: GenerateScriptRequest):
    if not EMERGENT_LLM_KEY:
        log.warning("EMERGENT_LLM_KEY missing — returning fallback script")
        return _fallback_script(req)

    import json, uuid, re
    session_id = f"script-{uuid.uuid4()}"
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=SCRIPT_SYSTEM_PROMPT,
    ).with_model("anthropic", ANTHROPIC_MODEL)

    user_msg = UserMessage(text=_build_user_prompt(req))
    try:
        resp = await chat.send_message(user_msg)
        text = resp if isinstance(resp, str) else str(resp)
        # Strip code fences if any
        text = text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.MULTILINE).strip()
        data = json.loads(text)
        required = ["opening", "main_message", "response_handling", "closing", "cta",
                    "short_version", "polite_version", "professional_version", "full_script"]
        for k in required:
            if k not in data:
                data[k] = ""
        return GenerateScriptResponse(**data)
    except Exception as e:
        log.exception("LLM script generation failed: %s", e)
        return _fallback_script(req)


class GenerateSummaryRequest(BaseModel):
    transcript: str
    language: Literal["en", "hi", "gu"] = "en"


class GenerateSummaryResponse(BaseModel):
    summary: str


@app.post("/api/llm/generate-summary", response_model=GenerateSummaryResponse)
async def generate_summary(req: GenerateSummaryRequest):
    if not EMERGENT_LLM_KEY:
        return GenerateSummaryResponse(summary="Summary unavailable.")
    import uuid
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"summary-{uuid.uuid4()}",
        system_message="You summarize Indian customer service phone-call transcripts into 2-3 sentence summaries with clear next-action recommendation. Plain text only.",
    ).with_model("anthropic", ANTHROPIC_MODEL)
    try:
        resp = await chat.send_message(UserMessage(text=f"Transcript:\n{req.transcript}\n\nSummarize."))
        return GenerateSummaryResponse(summary=str(resp).strip())
    except Exception as e:
        log.exception("LLM summary failed: %s", e)
        return GenerateSummaryResponse(summary="Summary unavailable.")


@app.get("/api/llm/health")
async def llm_health():
    return {"status": "ok", "model": ANTHROPIC_MODEL, "key_present": bool(EMERGENT_LLM_KEY)}


# ------------------- Reverse Proxy -------------------
# Everything else under /api/* goes to Next.js (which owns Postgres/TypeORM)
# Routes already defined above will be matched first by FastAPI.

# Use a shared client with a generous timeout (Next.js can be cold)
_proxy_client: Optional[httpx.AsyncClient] = None


@app.on_event("startup")
async def _startup():
    global _proxy_client
    _proxy_client = httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0))
    log.info("Receptify proxy started. NEXT_INTERNAL_URL=%s", NEXT_INTERNAL_URL)


@app.on_event("shutdown")
async def _shutdown():
    if _proxy_client:
        await _proxy_client.aclose()


HOP_BY_HOP = {
    "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
    "te", "trailer", "transfer-encoding", "upgrade", "content-length", "content-encoding", "host",
}


async def _proxy(request: Request, target_path: str) -> Response:
    assert _proxy_client is not None
    url = f"{NEXT_INTERNAL_URL}{target_path}"
    qs = request.url.query
    if qs:
        url = f"{url}?{qs}"

    headers = {k: v for k, v in request.headers.items() if k.lower() not in HOP_BY_HOP}
    headers["host"] = "localhost:3000"
    body = await request.body()

    try:
        r = await _proxy_client.request(
            method=request.method,
            url=url,
            headers=headers,
            content=body,
        )
    except httpx.RequestError as e:
        log.warning("Proxy upstream error %s for %s", e, url)
        raise HTTPException(status_code=502, detail=f"Upstream unavailable: {e}")

    out_headers = {k: v for k, v in r.headers.items() if k.lower() not in HOP_BY_HOP}
    return Response(content=r.content, status_code=r.status_code, headers=out_headers, media_type=r.headers.get("content-type"))


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def proxy_api(path: str, request: Request):
    return await _proxy(request, f"/api/{path}")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "receptify-backend"}
