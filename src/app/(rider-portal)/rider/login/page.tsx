"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Nfc, ShieldAlert, Bike } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthSubmitButton } from "@/components/auth/auth-form-elements";
import { getRiderSession, riderLogin } from "@/lib/rider-auth";

export default function RiderLoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (getRiderSession()) {
      router.replace("/rider");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      await riderLogin({
        email: form.get("email") as string,
        password: form.get("password") as string,
      });
      router.push("/rider");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-md">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-rider-blue">
          Rider Portal
        </p>
        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Nfc className="h-5 w-5 text-primary-green" strokeWidth={1.5} />
            <span className="text-base font-semibold tracking-tight text-dark-text">RiderPay</span>
          </div>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rider-blue/10">
              <Bike className="h-5 w-5 text-rider-blue" />
            </div>
            <h1 className="text-xl font-bold text-dark-text">Rider Access</h1>
            <p className="mt-1.5 text-sm text-medium-text">
              Field riders, supervisors, and fleet ops.
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
              placeholder="ahmed@riderpay.com"
              defaultValue="ahmed@riderpay.com"
              autoComplete="email"
              required
            />
            <AuthField
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <AuthSubmitButton disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </AuthSubmitButton>
          </form>

          <p className="mt-6 text-center text-xs text-medium-text">
            Demo: ahmed@riderpay.com / rider123 (Field) · lead@riderpay.com / lead123 (Supervisor) · fleet@riderpay.com / fleet123 (Ops)
          </p>
        </div>
      </div>
    </div>
  );
}
