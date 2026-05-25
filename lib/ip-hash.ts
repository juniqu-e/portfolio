import { createHash } from "node:crypto";

function getSalt(): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt || salt.length < 16) {
    throw new Error("IP_HASH_SALT is required (min 16 chars). See .env.example.");
  }
  return salt;
}

export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(ip + getSalt())
    .digest("hex");
}

export function extractIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "0.0.0.0";
}
