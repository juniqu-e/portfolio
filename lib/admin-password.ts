import { compareSync } from "bcryptjs";
import { timingSafeEqual } from "node:crypto";

export type AdminCredentials = {
  username: string;
  passwordHash: string;
};

export function getAdminCredentials(): AdminCredentials {
  const username = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!username || username.length === 0) {
    throw new Error("ADMIN_USERNAME is required. See .env.example.");
  }
  if (!passwordHash || !/^\$2[aby]\$/.test(passwordHash)) {
    throw new Error(
      "ADMIN_PASSWORD_HASH is required (bcrypt $2a$ / $2b$ / $2y$ format). See .env.example.",
    );
  }
  return { username, passwordHash };
}

export function verifyUsername(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyPassword(plain: string, hash: string): boolean {
  return compareSync(plain, hash);
}
