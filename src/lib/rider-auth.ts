import type { RiderRole } from "@/lib/rbac/rider";

export interface RiderSession {
  email: string;
  name: string;
  role: RiderRole;
  partnerName: string;
  city: string;
}

const SESSION_KEY = "riderpay_rider_session";

const RIDER_USERS: Record<
  string,
  { password: string; name: string; role: RiderRole; partnerName: string; city: string }
> = {
  "ahmed@riderpay.com": {
    password: "rider123",
    name: "Ahmed Raza",
    role: "field_rider",
    partnerName: "Leopards Courier Services",
    city: "Lahore",
  },
  "lead@riderpay.com": {
    password: "lead123",
    name: "Sara Khan",
    role: "supervisor",
    partnerName: "Leopards Courier Services",
    city: "Lahore",
  },
  "fleet@riderpay.com": {
    password: "fleet123",
    name: "Usman Ali",
    role: "rider_ops",
    partnerName: "Leopards Courier Services",
    city: "Lahore",
  },
};

export function listRiderDemoAccounts() {
  return Object.entries(RIDER_USERS).map(([email, user]) => ({
    portal: "Rider" as const,
    email,
    password: user.password,
    name: user.name,
    role: user.role,
    loginHref: "/rider/login",
  }));
}

export function getRiderSession(): RiderSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RiderSession;
  } catch {
    return null;
  }
}

export function setRiderSession(session: RiderSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearRiderSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function riderLogout() {
  clearRiderSession();
}

export async function riderLogin(params: {
  email: string;
  password: string;
}): Promise<RiderSession> {
  await new Promise((r) => setTimeout(r, 300));
  const email = params.email.trim().toLowerCase();
  const user = RIDER_USERS[email];

  if (!user || user.password !== params.password) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const session: RiderSession = {
    email,
    name: user.name,
    role: user.role,
    partnerName: user.partnerName,
    city: user.city,
  };

  setRiderSession(session);
  return session;
}
