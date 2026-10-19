import Link from "next/link";
import { Nfc } from "lucide-react";
import { getDemoAccountGroups } from "@/lib/demo-accounts";

export default function DemoAccountsPage() {
  const groups = getDemoAccountGroups();

  return (
    <div className="min-h-screen bg-content px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/login" className="inline-flex items-center gap-2">
            <Nfc className="h-5 w-5 text-primary-green" strokeWidth={1.5} />
            <span className="text-base font-semibold tracking-tight text-dark-text">
              RiderPay
            </span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-dark-text underline decoration-primary-green/40 underline-offset-4 hover:text-primary-green"
          >
            Back to login
          </Link>
        </div>

        <div className="rounded-2xl border border-light-border bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex items-center rounded-full border border-primary-green/20 bg-primary-green/[0.06] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary-green">
            Demo access
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-dark-text">
            Demo accounts
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-medium-text">
            Use any of these emails and passwords to sign in. Each group opens
            the matching login page.
          </p>

          <div className="mt-8 space-y-8">
            {groups.map((group) => (
              <section key={group.portal}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-dark-text">{group.portal}</h2>
                  <Link
                    href={group.loginHref}
                    className="text-xs font-medium text-primary-green hover:underline"
                  >
                    Open login
                  </Link>
                </div>
                <div className="overflow-x-auto rounded-xl border border-light-border">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-content text-xs uppercase tracking-wide text-medium-text">
                      <tr>
                        <th className="px-4 py-2.5 font-medium">Name</th>
                        <th className="px-4 py-2.5 font-medium">Role</th>
                        <th className="px-4 py-2.5 font-medium">Email</th>
                        <th className="px-4 py-2.5 font-medium">Password</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.accounts.map((account) => (
                        <tr key={account.email} className="border-t border-light-border">
                          <td className="px-4 py-3 text-dark-text">{account.name}</td>
                          <td className="px-4 py-3 text-medium-text">{account.role}</td>
                          <td className="px-4 py-3 font-medium text-dark-text">{account.email}</td>
                          <td className="px-4 py-3 font-mono text-dark-text">{account.password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
