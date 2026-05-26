type Bucket = { count: number; resetAt: number };

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 300_000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 1);

const buckets = new Map<string, Bucket>();

let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSec: number;
};

export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

// 로그인 전용 — 별도 Map / 별도 윈도우 (5분) / 별도 최대 (실패 5회).
// 성공 후에도 카운터는 자동 소멸 (resetAt 경과). 명시적 reset 불필요.
const LOGIN_WINDOW_MS = 5 * 60_000;
const LOGIN_MAX_FAILURES = 5;
const loginBuckets = new Map<string, Bucket>();
let loginLastSweep = 0;

function loginSweep(now: number) {
  if (now - loginLastSweep < LOGIN_WINDOW_MS) return;
  loginLastSweep = now;
  for (const [key, b] of loginBuckets) {
    if (b.resetAt <= now) loginBuckets.delete(key);
  }
}

// 현재 카운터를 확인만 (증가 X). 잠긴 상태면 allowed=false 반환.
export function checkLoginAttempt(key: string, now = Date.now()): RateLimitResult {
  loginSweep(now);
  const bucket = loginBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    return { allowed: true, retryAfterSec: 0 };
  }
  if (bucket.count >= LOGIN_MAX_FAILURES) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSec: 0 };
}

// 실패 1회 기록.
export function recordLoginFailure(key: string, now = Date.now()): void {
  loginSweep(now);
  const bucket = loginBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    loginBuckets.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  bucket.count += 1;
}
