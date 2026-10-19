import Link from "next/link";
import { Nfc } from "lucide-react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  headline: string;
  description: string;
}

export function AuthSplitLayout({
  children,
  headline,
  description,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-[48%] overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 100% 100%, transparent 20%, white 21%, transparent 22%),
              radial-gradient(circle at 100% 100%, transparent 35%, white 36%, transparent 37%),
              radial-gradient(circle at 100% 100%, transparent 50%, white 51%, transparent 52%),
              radial-gradient(circle at 100% 100%, transparent 65%, white 66%, transparent 67%)`,
            backgroundSize: "100% 100%",
          }}
        />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[480px] w-[480px] rounded-full bg-primary-green/10 blur-3xl" />

        <div className="relative z-10 p-10 xl:p-14">
          <Link href="/login" className="inline-flex items-center gap-2">
            <Nfc className="h-6 w-6 text-primary-green" strokeWidth={1.5} />
            <span className="text-xl font-semibold tracking-tight text-white">
              RiderPay
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md px-10 pb-16 xl:px-14 xl:pb-20">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
            {headline}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-gray-400">
            {description}
          </p>
        </div>

        <p className="relative z-10 px-10 pb-8 text-xs text-gray-500 xl:px-14">
          © {new Date().getFullYear()} RiderPay. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col bg-content">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/login" className="inline-flex items-center gap-2">
            <Nfc className="h-5 w-5 text-primary-green" strokeWidth={1.5} />
            <span className="text-lg font-semibold text-dark-text">RiderPay</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-[440px] rounded-2xl border border-light-border bg-white p-7 shadow-sm sm:p-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
