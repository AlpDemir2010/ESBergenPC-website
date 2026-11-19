import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "pc_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // one week
const SESSION_MESSAGE = "pupils-committee-admin-session-v1";

/**
 * The password never leaves this module. We only ever compare digests, and
 * the session token is an HMAC, so the raw secret cannot be recovered from it.
 */
function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function key(): Buffer {
  return createHmac("sha256", "pupils-committee-session-key")
    .update(adminPassword())
    .digest();
}

export function verifyPassword(input: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function createSessionToken(): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;

  const numeric = Number(expiresAt);
  if (!Number.isFinite(numeric) || numeric * 1000 <= Date.now()) return false;

  return safeEqual(signature, sign(expiresAt));
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

function sign(value: string): string {
  return createHmac("sha256", key()).update(`${SESSION_MESSAGE}:${value}`).digest("hex");
}

/** Length-safe constant-time comparison. */
function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    // Still do a comparison of equal-length buffers so the timing does not
    // leak the length of the expected value.
    timingSafeEqual(bufferA, bufferA);
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}
