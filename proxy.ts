import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const encoder = new TextEncoder();

/**
 * Constant-time equality for two equal-length byte arrays (Edge-safe).
 */
function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}

async function sha256Utf8(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return new Uint8Array(digest);
}

/**
 * Timing-safe string comparison via SHA-256 digests (fixed 32-byte compare).
 * Suitable for Edge middleware where Node's crypto.timingSafeEqual is unavailable.
 */
async function timingSafeStringEqual(a: string, b: string): Promise<boolean> {
  const [digestA, digestB] = await Promise.all([sha256Utf8(a), sha256Utf8(b)]);
  return timingSafeEqualBytes(digestA, digestB);
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Restricted"',
    },
  });
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword === undefined || sitePassword === "") {
    return NextResponse.next();
  }

  const expectedUser = process.env.SITE_USERNAME ?? "rakshan";

  const auth = request.headers.get("authorization");
  if (auth === null || !auth.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded: string;
  try {
    decoded = atob(auth.slice(6));
  } catch {
    return unauthorized();
  }

  const colon = decoded.indexOf(":");
  const providedUser = colon === -1 ? decoded : decoded.slice(0, colon);
  const providedPassword = colon === -1 ? "" : decoded.slice(colon + 1);

  const [userOk, passwordOk] = await Promise.all([
    timingSafeStringEqual(providedUser, expectedUser),
    timingSafeStringEqual(providedPassword, sitePassword),
  ]);

  if (!userOk || !passwordOk) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon\\.ico).*)"],
};
