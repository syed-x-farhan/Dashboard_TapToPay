import type { MerchantRole } from "@/lib/rbac/merchant";
import type { PartnerRole } from "@/lib/rbac/partner";
import { normalizeAccountStatus } from "@/lib/api-normalize";

export type AccountType = "merchant" | "partner";
export type AccountStatus = "active" | "pending";
export type CompanyType =
  | "Food Delivery"
  | "Courier and Logistics"
  | "Retail Marketplace"
  | "Restaurant Chain"
  | "Other";

export interface AuthSession {
  accountType: AccountType;
  status: AccountStatus;
  email: string;
  companyType?: CompanyType;
  name: string;
  role: PartnerRole | MerchantRole;
}

const SESSION_KEY = "riderpay_session";

const AUTH_TOKEN_KEYS = [
  "riderpay_token",
  "auth_token",
] as const;

function readTokenFromStorages(keys: readonly string[]): string | null {
  for (const key of keys) {
    const fromLocal = localStorage.getItem(key);
    if (fromLocal) return fromLocal;
  }
  for (const key of keys) {
    const fromSession = sessionStorage.getItem(key);
    if (fromSession) return fromSession;
  }
  return null;
}

function writeTokenToStorages(keys: readonly string[], token: string): void {
  for (const key of keys) {
    localStorage.setItem(key, token);
    sessionStorage.setItem(key, token);
  }
}

function clearTokenStorages(keys: readonly string[]): void {
  for (const key of keys) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

const PORTAL_USERS: Record<
  string,
  {
    password: string;
    accountType: AccountType;
    role: PartnerRole | MerchantRole;
    name: string;
    status?: AccountStatus;
    companyType?: CompanyType;
  }
> = {
  "ops@leopardscourier.com": {
    password: "demo",
    accountType: "partner",
    role: "admin",
    name: "Leopards Courier Services",
    companyType: "Courier and Logistics",
  },
  "manager@leopardscourier.com": {
    password: "demo",
    accountType: "partner",
    role: "manager",
    name: "Leopards Courier Services",
    companyType: "Courier and Logistics",
  },
  "viewer@leopardscourier.com": {
    password: "demo",
    accountType: "partner",
    role: "viewer",
    name: "Leopards Courier Services",
    companyType: "Courier and Logistics",
  },
  "merchant@kfcgulberg.com": {
    password: "demo",
    accountType: "merchant",
    role: "owner",
    name: "KFC Gulberg Branch",
  },
  "manager@kfcgulberg.com": {
    password: "demo",
    accountType: "merchant",
    role: "manager",
    name: "KFC Gulberg Branch",
  },
  "staff@kfcgulberg.com": {
    password: "demo",
    accountType: "merchant",
    role: "staff",
    name: "KFC Gulberg Branch",
  },
  "viewer@kfcgulberg.com": {
    password: "demo",
    accountType: "merchant",
    role: "viewer",
    name: "KFC Gulberg Branch",
  },
};

export function listPortalDemoAccounts() {
  return Object.entries(PORTAL_USERS).map(([email, user]) => ({
    portal: user.accountType === "partner" ? ("Partner" as const) : ("Merchant" as const),
    email,
    password: user.password,
    name: user.name,
    role: user.role,
    loginHref:
      user.accountType === "partner"
        ? "/login?accountType=partner"
        : "/login?accountType=merchant",
  }));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  clearTokenStorages(AUTH_TOKEN_KEYS);
}

export function logout() {
  clearSession();
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return readTokenFromStorages(AUTH_TOKEN_KEYS);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  writeTokenToStorages(AUTH_TOKEN_KEYS, token);
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function sessionFromAuthResponse(
  data: Record<string, unknown>,
  accountType: AccountType
): AuthSession {
  const user = (data.user ?? data) as Record<string, unknown>;
  const rawStatus = user.status ?? user.accountStatus ?? user.account_status;
  const rawRole = String(user.role ?? defaultRole(accountType)).toLowerCase();
  const rawName =
    user.name ??
    user.businessName ??
    user.business_name ??
    user.company_name ??
    "";

  return {
    accountType:
      (user.accountType as AccountType) ??
      (user.account_type as AccountType) ??
      accountType,
    status: normalizeAccountStatus(rawStatus),
    email: String(user.email ?? ""),
    name: String(rawName),
    role: (rawRole as PartnerRole | MerchantRole) ?? defaultRole(accountType),
    companyType:
      (user.companyType as CompanyType | undefined) ??
      (user.company_type as CompanyType | undefined),
  };
}

function defaultRole(accountType: AccountType): PartnerRole | MerchantRole {
  return accountType === "partner" ? "admin" : "owner";
}

export async function login(params: {
  email: string;
  password: string;
  accountType: AccountType;
}): Promise<AuthSession> {
  await new Promise((r) => setTimeout(r, 300));

  const email = params.email.trim().toLowerCase();
  const known = PORTAL_USERS[email];

  if (known) {
    if (known.password !== params.password) {
      throw new Error("INVALID_CREDENTIALS");
    }
    if (known.accountType !== params.accountType) {
      throw new Error("WRONG_PORTAL");
    }
    const session: AuthSession = {
      accountType: known.accountType,
      status: known.status ?? "active",
      email,
      name: known.name,
      role: known.role,
      companyType: known.companyType,
    };
    setSession(session);
    return session;
  }

  const session: AuthSession = {
    accountType: params.accountType,
    status: "active",
    email,
    name:
      params.accountType === "partner"
        ? "Leopards Courier Services"
        : "KFC Gulberg Branch",
    role: defaultRole(params.accountType),
    companyType:
      params.accountType === "partner" ? "Courier and Logistics" : undefined,
  };
  setSession(session);
  return session;
}

export async function signup(params: {
  email: string;
  password: string;
  accountType: AccountType;
  companyType: CompanyType;
  businessName: string;
}): Promise<AuthSession> {
  await new Promise((r) => setTimeout(r, 300));
  const session: AuthSession = {
    accountType: params.accountType,
    status: params.accountType === "partner" ? "pending" : "active",
    email: params.email.trim().toLowerCase(),
    name: params.businessName,
    role: params.accountType === "partner" ? "owner" : "owner",
    companyType: params.companyType,
  };
  setSession(session);
  return session;
}

export function getPostLoginPath(session: AuthSession): string {
  if (session.accountType === "partner") {
    return session.status === "pending" ? "/partner/pending-approval" : "/partner";
  }
  return "/";
}

export async function loginMerchant(
  email: string,
  password: string
): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, accountType: "merchant" }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }
  const data = await response.json();
  setAuthToken(data.token);
  const session = sessionFromAuthResponse(data, "merchant");
  setSession(session);
  return session;
}

export async function loginPartner(
  email: string,
  password: string
): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, accountType: "partner" }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }
  const data = await response.json();
  setAuthToken(data.token);
  const session = sessionFromAuthResponse(data, "partner");
  setSession(session);
  return session;
}

export async function signupMerchant(body: {
  email: string;
  password: string;
  businessName: string;
  ownerName: string;
  cnic: string;
  phone: string;
  jazzCashNumber: string;
  companyType: string;
}): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, accountType: "merchant" }),
  });
  if (!response.ok) {
    const err = (await response.json()) as { message?: string };
    throw new Error(err.message || "Signup failed");
  }
  const data = await response.json();
  setAuthToken(data.token);
  const session = sessionFromAuthResponse(data, "merchant");
  setSession(session);
  return session;
}

export async function signupPartner(body: {
  email: string;
  password: string;
  businessName: string;
  ownerName: string;
  companyType: string;
  cnic: string;
  phone: string;
}): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, accountType: "partner" }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Signup failed");
  }
  const data = await response.json();
  setAuthToken(data.token);
  const session = sessionFromAuthResponse(data, "partner");
  setSession(session);
  return session;
}
