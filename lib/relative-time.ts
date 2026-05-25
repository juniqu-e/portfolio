// 라이브러리 미사용 (date-fns 등). 한국어 상대시간.
// 7일 이상은 "YYYY.MM.DD" 절대 표기로 fallback.

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function formatRelative(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";

  const diff = now.getTime() - then.getTime();

  if (diff < 0) return "방금 전";
  if (diff < MINUTE) return "방금 전";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}시간 전`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)}일 전`;

  return `${then.getFullYear()}.${pad2(then.getMonth() + 1)}.${pad2(then.getDate())}`;
}
