import { NextResponse } from "next/server";

import { contactFormSchema } from "@/lib/schema/contact";

type RateBucket = {
  count: number;
  resetAtMs: number;
};

const bucketByIp = new Map<string, RateBucket>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [ip] = forwardedFor.split(",");
    if (ip) {
      return ip.trim();
    }
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = Number(process.env.CONTACT_FORM_RATE_LIMIT_WINDOW_MS ?? 60_000);
  const maxRequests = Number(process.env.CONTACT_FORM_RATE_LIMIT_MAX ?? 5);

  const existing = bucketByIp.get(ip);

  if (!existing || existing.resetAtMs <= now) {
    bucketByIp.set(ip, {
      count: 1,
      resetAtMs: now + windowMs,
    });
    return false;
  }

  existing.count += 1;
  bucketByIp.set(ip, existing);
  return existing.count > maxRequests;
}

export async function POST(request: Request): Promise<NextResponse> {
  const featureEnabled = process.env.ENABLE_CONTACT_FORM === "true";

  if (!featureEnabled) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  if (parsed.data.company.length > 0) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Contact form backend is not configured." }, { status: 503 });
  }

  const relayResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      submittedAt: new Date().toISOString(),
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!relayResponse?.ok) {
    return NextResponse.json({ error: "Failed to submit message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
