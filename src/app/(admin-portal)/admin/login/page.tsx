"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Nfc, ShieldAlert } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthSubmitButton } from "@/components/auth/auth-form-elements";
import {
  loginAdmin,
  getAdminSession,
} from "@/admin-portal/lib/auth";
import { DemoAccountsLink } from "@/components/auth/demo-accounts-link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (getAdminSession()) {
      router.replace("/admin");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string).trim().toLowerCase();

    try {
      await loginAdmin(
        email,
        form.get("password") as string
      );
      router.push("/admin");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-md">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-rider-red">
          Admin Portal
        </p>
        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Nfc className="h-5 w-5 text-primary-green" strokeWidth={1.5} />
            <span className="text-base font-semibold tracking-tight text-dark-text">
              RiderPay
            </span>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-dark-text">Internal Access</h1>
            <p className="mt-1.5 text-sm text-medium-text">
              Authorized ops team only. No public signup.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rider-red/20 bg-rider-red/5 px-3 py-2.5 text-sm text-rider-red">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthField
              label="Email address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="fahad@riderpay.com"
              required
            />
            <AuthField
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              required
            />
            <AuthSubmitButton disabled={loading}>
              {loading ? "Signing in..." : "Sign in to Admin"}
            </AuthSubmitButton>
          </form>

          <DemoAccountsLink className="mt-6" />
        </div>
      </div>
    </div>
  );
}
