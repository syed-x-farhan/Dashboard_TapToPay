"use client";

import * as React from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

export function AuthField({
  label,
  icon: Icon,
  className,
  id,
  type,
  ...props
}: AuthFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="text-[13px] font-medium text-dark-text"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-medium-text"
            strokeWidth={1.5}
          />
        )}
        <input
          id={fieldId}
          type={inputType}
          className={cn(
            "h-11 w-full rounded-xl border border-light-border bg-white text-sm text-dark-text outline-none transition-all placeholder:text-gray-400",
            "focus:border-primary-green/40 focus:ring-2 focus:ring-primary-green/10",
            Icon ? "pl-10 pr-3.5" : "px-3.5",
            isPassword && "pr-10",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-medium-text transition-colors hover:text-dark-text"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
