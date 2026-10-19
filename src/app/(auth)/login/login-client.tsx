"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Nfc, ShieldAlert } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { AuthField } from "@/components/auth/auth-field";
import { AuthPortalToggle } from "@/components/auth/auth-portal-toggle";
import {
  AuthFormHeader,
  AuthFormLink,
} from "@/components/auth/auth-form-header";
import { DemoAccountsLink } from "@/components/auth/demo-accounts-link";
import {
  AuthDivider,
  AuthGoogleButton,
  AuthSubmitButton,
} from "@/components/auth/auth-form-elements";
import {
  login,
  loginMerchant,
  loginPartner,
  getPostLoginPath,
  type AccountType,
} from "@/lib/auth";

const loginCopy = {
  merchant: {
    headline: "Hello, Merchant",
    description:
      "Accept NFC payments, track settlements, and manage your Jazz Cash wallet — all in one clean dashboard.",
    badge: "Merchant Portal",
  },
  partner: {
    headline: "Hello, Partner",
    description:
      "Manage merchants, riders, settlements, and platform operations across your entire network.",
    badge: "Partner Portal",
  },
};

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("accountType") as AccountType) ?? "merchant";
  const [accountType, setAccountType] = React.useState<AccountType>(initialType);
  const [remember, setRemember] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const copy = loginCopy[accountType];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const session =
        accountType === "partner"
          ? await loginPartner(email, password)
          : await loginMerchant(email, password);
      router.push(getPostLoginPath(session));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitLayout headline={copy.headline} description={copy.description}>
      <div className="mb-6 flex items-center gap-2 lg:mb-8">
        <Nfc className="h-5 w-5 text-primary-green" strokeWidth={1.5} />
        <span className="text-base font-semibold tracking-tight text-dark-text">
          RiderPay
        </span>
      </div>

      <AuthPortalToggle value={accountType} onChange={setAccountType} />

      <AuthFormHeader
        badge={copy.badge}
        title="Welcome back"
        description={
          <>
            Don&apos;t have an account?{" "}
            <AuthFormLink href={`/signup?accountType=${accountType}`}>
              Create one now
            </AuthFormLink>
            — it&apos;s free.
          </>
        }
      />

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
          placeholder="you@business.com"
          defaultValue={
            accountType === "partner"
              ? "ops@leopardscourier.com"
              : "merchant@kfcgulberg.com"
          }
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

        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-light-border accent-primary-green"
            />
            <span className="text-xs text-medium-text">Remember me</span>
          </label>
          <button
            type="button"
            className="text-xs font-medium text-dark-text hover:text-primary-green"
          >
            Forgot password?
          </button>
        </div>

        <div className="space-y-3 pt-2">
          <AuthSubmitButton disabled={loading}>
            {loading ? "Signing in..." : "Login now"}
          </AuthSubmitButton>
          <AuthDivider />
          <AuthGoogleButton
            onClick={async () => {
              const session = await login({
                email: "demo@riderpay.pk",
                password: "demo",
                accountType,
              });
              router.push(getPostLoginPath(session));
            }}
          />
        </div>
      </form>

      <DemoAccountsLink className="mt-7" />

      <p className="mt-3 text-center text-xs text-medium-text">
        Protected by RiderPay.{" "}
        <Link href="#" className="font-medium underline underline-offset-2">
          Terms
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
