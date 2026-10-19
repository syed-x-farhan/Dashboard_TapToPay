import type { AdminRole, AdminSession } from "../types";

const SESSION_KEY = "riderpay_admin_session";

const ADMIN_TOKEN_KEYS = [
  "riderpay_admin_token",
  "admin_token",
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

const ADMIN_USERS: Record<
  string,
  { password: string; name: string; role: AdminRole }
> = {
  "fahad@riderpay.com": {
    password: "admin123",
    name: "Fahad Khan",
    role: "super_admin",
  },
  "admin@riderpay.com": {
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  "ops@riderpay.com": {
    password: "ops123",
    name: "Ops User",
    role: "ops",
  },
};

export function listAdminDemoAccounts() {
  return Object.entries(ADMIN_USERS).map(([email, user]) => ({
    portal: "Admin" as const,
    email,
    password: user.password,
    name: user.name,
    role: user.role,
    loginHref: "/admin/login",
  }));
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function setAdminSession(session: AdminSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
  clearTokenStorages(ADMIN_TOKEN_KEYS);
}

export function adminLogout() {
  clearAdminSession();
}

export function getAdminAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return readTokenFromStorages(ADMIN_TOKEN_KEYS);
}

export function setAdminAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  writeTokenToStorages(ADMIN_TOKEN_KEYS, token);
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getAdminRoleLabel(role: AdminRole): string {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return "Admin";
  return "Ops";
}

export async function adminLogin(params: {
  email: string;
  password: string;
}): Promise<AdminSession> {
  await new Promise((r) => setTimeout(r, 300));

  const email = params.email.trim().toLowerCase();
  const user = ADMIN_USERS[email];

  if (!user) {
    throw new Error("PERMISSION_DENIED");
  }

  if (user.password !== params.password) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const session: AdminSession = {
    email,
    name: user.name,
    role: user.role,
  };

  setAdminSession(session);
  return session;
}

export function isAdminRole(role: string): role is AdminRole {
  return role === "super_admin" || role === "admin" || role === "ops";
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<AdminSession> {
  const response = await fetch(`${API_URL}/api/v1/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = (await response.json()) as {
      message?: string;
      detail?: string;
    };
    throw new Error(err.message || err.detail || "Login failed");
  }
  const data = await response.json();
  setAdminAuthToken(data.token ?? data.access_token);
  const user = (data.user ?? data) as Record<string, unknown>;
  const rawRole = String(user.role ?? "ops").toLowerCase();
  const session: AdminSession = {
    email: String(user.email ?? email),
    name: String(user.name ?? ""),
    role: isAdminRole(rawRole) ? rawRole : "ops",
  };
  setAdminSession(session);
  return session;
}
