"use client";

import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const emailInputVariants = cva(
  "flex items-center gap-2 overflow-hidden rounded-[10px] bg-transparent pl-5 pr-3 py-2.5 md:py-3 shadow-[0px_4px_16px_rgba(0,0,0,0.15)] transition-all",
  {
    variants: {
      responsive: {
        desktop: "w-[470px]",
        mobile: "w-[336px]",
      },
    },
    defaultVariants: {
      responsive: "desktop",
    },
  }
);

export interface EmailSignupInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof emailInputVariants> {
  onSubmit?: () => void;
}

const EmailSignupInput = React.forwardRef<
  HTMLInputElement,
  EmailSignupInputProps
>(({ className, responsive, onSubmit, ...props }, ref) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(emailInputVariants({ responsive }), className)}
    >
      <input
        ref={ref}
        type="email"
        placeholder="Your Email"
        className={cn(
          "flex-1 bg-transparent text-[14px] text-[#FFF5DC] placeholder:text-[#FFF5DC] tracking-[0.01em] focus-visible:outline-none md:text-[16px]"
        )}
        {...props}
      />
      <button
        type="submit"
        className="flex h-8 w-8 p-1 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-label="Submit email"
      >
        <Image
          src="/svg/bell.svg"
          alt=""
          width={16}
          height={16}
          className="text-white"
        />
      </button>
    </form>
  );
});

EmailSignupInput.displayName = "EmailSignupInput";

export { EmailSignupInput, emailInputVariants };
