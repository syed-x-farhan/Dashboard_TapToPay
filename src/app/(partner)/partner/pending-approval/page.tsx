"use client";

import { useRouter } from "next/navigation";
import { Clock, Nfc } from "lucide-react";
import { logout } from "@/lib/auth";

export default function PartnerPendingApprovalPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-content px-4">
      <div className="w-full max-w-md rounded-2xl border border-light-border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex items-center justify-center gap-2">
          <Nfc className="h-6 w-6 text-primary-green" strokeWidth={1.5} />
          <span className="text-lg font-semibold text-dark-text">RiderPay</span>
        </div>

        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-rider-amber/10">
          <Clock className="h-7 w-7 text-rider-amber" strokeWidth={1.5} />
        </div>

        <h1 className="text-xl font-bold text-dark-text">Account Under Review</h1>
        <p className="mt-3 text-sm leading-relaxed text-medium-text">
          Your partner account is being reviewed by our team. You will receive an
          email at your registered address within 24 hours.
        </p>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login?accountType=partner");
          }}
          className="mt-8 text-sm font-medium text-dark-text underline underline-offset-4 hover:text-primary-green"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
