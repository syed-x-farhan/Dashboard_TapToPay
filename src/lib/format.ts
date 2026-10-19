import { format } from "date-fns";

function toNumber(value: number | null | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function formatPKR(amount: number | null | undefined): string {
  return `Rs. ${toNumber(amount).toLocaleString("en-PK")}`;
}

export function formatCount(value: number | null | undefined): string {
  return toNumber(value).toLocaleString("en-PK");
}

/** Parse ISO or dd/MM/yyyy strings from API */
export function parseFlexibleDate(value: Date | string): Date {
  if (value instanceof Date) return value;
  if (value.includes("T") || value.includes("-")) {
    const iso = new Date(value);
    if (!Number.isNaN(iso.getTime())) return iso;
  }
  const parts = value.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    const d = new Date(year, month - 1, day);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? new Date() : fallback;
}

export function formatDate(date: Date | string): string {
  return format(parseFlexibleDate(date), "dd/MM/yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(parseFlexibleDate(date), "dd/MM/yyyy HH:mm");
}

export function formatSignedPKR(amount: number | null | undefined): string {
  const value = toNumber(amount);
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${formatPKR(Math.abs(value))}`;
}
