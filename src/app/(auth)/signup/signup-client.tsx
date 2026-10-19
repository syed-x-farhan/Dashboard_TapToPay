"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  Nfc,
  Smartphone,
  User,
  Briefcase,
  ShieldAlert,
} from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { AuthField } from "@/components/auth/auth-field";
import {
  AuthFormHeader,
  AuthFormLink,
} from "@/components/auth/auth-form-header";
import { AuthSubmitButton } from "@/components/auth/auth-form-elements";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  signupMerchant,
  signupPartner,
  getPostLoginPath,
  type AccountType,
  type CompanyType,
} from "@/lib/auth";

const companyTypes: CompanyType[] = [
  "Food Delivery",
  "Courier and Logistics",
  "Retail Marketplace",
  "Restaurant Chain",
  "Other",
];

export default function SignupPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountType = (searchParams.get("accountType") as AccountType) ?? "merchant";
  const isPartner = accountType === "partner";
  const [companyType, setCompanyType] = React.useState<CompanyType>(
    isPartner ? "Courier and Logistics" : "Restaurant Chain"
  );
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const session = isPartner
        ? await signupPartner({
            email: form.get("email") as string,
            password: form.get("password") as string,
            businessName: form.get("businessName") as string,
            ownerName: form.get("ownerName") as string,
            companyType,
            cnic: form.get("cnic") as string,
            phone: form.get("phone") as string,
          })
        : await signupMerchant({
            email: form.get("email") as string,
            password: form.get("password") as string,
            businessName: form.get("businessName") as string,
            ownerName: form.get("ownerName") as string,
            cnic: form.get("cnic") as string,
            phone: (form.get("jazzCash") as string) ?? "",
            jazzCashNumber: (form.get("jazzCash") as string) ?? "",
            companyType,
          });
      router.push(getPostLoginPath(session));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitLayout
      headline={isPartner ? "Join as Partner" : "Join RiderPay"}
      description={
        isPartner
          ? "Register your logistics or delivery company to manage merchants and riders on RiderPay."
          : "Start accepting tap-to-pay from delivery riders. Register your business and go live in under a minute."
      }
    >
      <div className="mb-6 flex items-center gap-2 lg:mb-8">
        <Nfc className="h-5 w-5 text-primary-green" strokeWidth={1.5} />
        <span className="text-base font-semibold tracking-tight text-dark-text">
          RiderPay
        </span>
      </div>

      <AuthFormHeader
        badge={isPartner ? "Partner Portal" : "Merchant Portal"}
        title="Create your account"
        description={
          <>
            Already registered?{" "}
            <AuthFormLink href={`/login?accountType=${accountType}`}>
              Login here
            </AuthFormLink>
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
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            label={isPartner ? "Company name" : "Business name"}
            name="businessName"
            type="text"
            icon={Building2}
            defaultValue={isPartner ? "Leopards Courier Services" : "KFC Gulberg Branch"}
            required
          />
          <AuthField
            label="Owner name"
            name="ownerName"
            type="text"
            icon={User}
            defaultValue="Hassan Malik"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium text-dark-text">Company type</Label>
          <Select value={companyType} onValueChange={(v) => setCompanyType(v as CompanyType)}>
            <SelectTrigger className="h-11 w-full rounded-xl border-light-border">
              <Briefcase className="mr-2 h-4 w-4 text-medium-text" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companyTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AuthField label="Email address" name="email" type="email" icon={Mail} required />

        <AuthField
          label="CNIC"
          name="cnic"
          type="text"
          icon={User}
          placeholder="35202-1234567-1"
          required
        />
        <AuthField
          label={isPartner ? "Phone number" : "Jazz Cash number"}
          name={isPartner ? "phone" : "jazzCash"}
          type="tel"
          icon={Smartphone}
          placeholder="0300-1234567"
          required
        />

        <AuthField label="Password" name="password" type="password" icon={Lock} required />

        <div className="pt-2">
          <AuthSubmitButton disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </AuthSubmitButton>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-medium-text">
        By signing up, you agree to RiderPay&apos;s Terms and Privacy Policy.
      </p>
    </AuthSplitLayout>
  );
}
