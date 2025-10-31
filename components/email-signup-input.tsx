"use client";

import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================================================
// Type Definitions
// ============================================================================

type EmailInputState = "default" | "submitted" | "success" | "error";

// ============================================================================
// CVA Variants
// ============================================================================

const containerVariants = cva(
  "flex items-center gap-2 overflow-hidden rounded-[10px] pl-5 pr-3 py-2.5 md:py-3 transition-all",
  {
    variants: {
      responsive: {
        desktop: "w-[470px]",
        mobile: "w-[336px]",
      },
      state: {
        default: "bg-transparent shadow-[0px_4px_16px_rgba(0,0,0,0.15)]",
        submitted:
          "bg-transparent backdrop-blur-lg shadow-[0px_4px_16px_rgba(0,0,0,0.15)]",
        success: "bg-transparent shadow-[0px_4px_16px_rgba(0,0,0,0.15)]",
        error:
          "bg-[rgba(255,255,255,0.05)] shadow-[0px_4px_16px_rgba(0,0,0,0.15)]",
      },
    },
    defaultVariants: {
      responsive: "desktop",
      state: "default",
    },
  }
);

const buttonVariants = cva(
  "flex h-8 w-8 p-1 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
  {
    variants: {
      state: {
        default: "bg-white/10 hover:bg-white/20",
        submitted:
          "bg-gradient-to-b from-[rgba(98.77,0,185.20,0.70)] to-[rgba(213.62,107.38,107.38,0.70)] shadow-[0px_4px_16px_rgba(0,0,0,0.15)] hover:opacity-90",
        success:
          "bg-gradient-to-b from-[#5EE848] to-[#6FDDAF] mix-blend-overlay hover:opacity-90",
        error: "bg-white/10 hover:bg-white/20",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

const inputVariants = cva(
  "flex-1 bg-transparent tracking-[0.01em] focus-visible:outline-none text-[14px] md:text-[16px]",
  {
    variants: {
      state: {
        default: "text-[#FFF5DC] placeholder:text-[#FFF5DC]",
        submitted: "text-white placeholder:text-white",
        success: "text-[#FFF5DC] cursor-not-allowed",
        error: "text-[#FFF5DC] placeholder:text-[#FFF5DC]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

// ============================================================================
// Props Interface
// ============================================================================

export interface EmailSignupInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "onSubmit" | "onChange" | "onError"
    >,
    VariantProps<typeof containerVariants> {
  /** Callback for form submission (async for API integration) */
  onSubmit?: (email: string) => Promise<void>;

  /** Success callback triggered after auto-reset */
  onSuccess?: () => void;

  /** Error callback with error message */
  onError?: (error: string) => void;

  /** Custom error message (overrides default) */
  errorMessage?: string;

  /** Auto-reset success state after N milliseconds (default: 3000) */
  successResetDelay?: number;

  /** Controlled state (optional, for external state management) */
  state?: EmailInputState;

  /** State change callback for controlled mode */
  onStateChange?: (state: EmailInputState) => void;
}

// ============================================================================
// Component
// ============================================================================

const EmailSignupInput = React.forwardRef<
  HTMLInputElement,
  EmailSignupInputProps
>(
  (
    {
      className,
      responsive,
      onSubmit,
      onSuccess,
      onError,
      errorMessage,
      successResetDelay = 3000,
      state: controlledState,
      onStateChange,
      ...props
    },
    ref
  ) => {
    // ========================================================================
    // State Management
    // ========================================================================

    const [internalState, setInternalState] =
      React.useState<EmailInputState>("default");
    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState("");

    // Use controlled state if provided, otherwise internal
    const state = controlledState ?? internalState;
    const setState = (newState: EmailInputState) => {
      onStateChange?.(newState);
      if (!controlledState) {
        setInternalState(newState);
      }
    };

    // ========================================================================
    // Email Validation
    // ========================================================================

    const isValidEmailFormat = (email: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // ========================================================================
    // Auto-reset Success State
    // ========================================================================

    React.useEffect(() => {
      if (state === "success") {
        const timer = setTimeout(() => {
          setState("default");
          setEmail("");
          setError("");
          onSuccess?.();
        }, successResetDelay);

        return () => clearTimeout(timer);
      }
    }, [state, successResetDelay, onSuccess]);

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);

      // Clear error if valid format entered
      if (error && isValidEmailFormat(value)) {
        setError("");
      }

      // Update state based on input value
      if (!value) {
        setState("default");
      } else {
        setState("submitted");
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate email format
      if (!email || !isValidEmailFormat(email)) {
        const errMsg = errorMessage || "Invalid email address.";
        setState("error");
        setError(errMsg);
        onError?.(errMsg);
        return;
      }

      // Call async onSubmit if provided
      if (onSubmit) {
        try {
          await onSubmit(email);
          setState("success");
          setError("");
        } catch (err) {
          const errMsg =
            errorMessage ||
            (err instanceof Error ? err.message : "Submission failed.");
          setState("error");
          setError(errMsg);
          onError?.(errMsg);
        }
      } else {
        // If no onSubmit provided, just show success
        setState("success");
        setError("");
      }
    };

    // ========================================================================
    // Icon Selection
    // ========================================================================

    const getIcon = (): string => {
      switch (state) {
        case "submitted":
          return "/svg/arrow-up.svg";
        case "success":
          return "/svg/check.svg";
        case "error":
        case "default":
        default:
          return "/svg/bell.svg";
      }
    };

    // ========================================================================
    // Render
    // ========================================================================

    return (
      <div className="flex flex-col gap-1">
        <form
          onSubmit={handleSubmit}
          noValidate
          className={cn(
            containerVariants({ responsive, state }),
            className
          )}
        >
          <input
            ref={ref}
            type="email"
            value={state === "success" ? "Subscribed!" : email}
            onChange={handleChange}
            placeholder="Your Email"
            readOnly={state === "success"}
            className={cn(inputVariants({ state }))}
            autoComplete="email"
            {...props}
          />
          <button
            type="submit"
            disabled={state === "success"}
            className={cn(buttonVariants({ state }))}
            aria-label={
              state === "success" ? "Subscribed" : "Submit email"
            }
          >
            <Image
              src={getIcon()}
              alt=""
              width={16}
              height={16}
            />
          </button>
        </form>

        {/* Error message */}
        {state === "error" && error && (
          <span
            className="text-[#640500] text-[14px] tracking-[0.14px] font-[Inter]"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

EmailSignupInput.displayName = "EmailSignupInput";

export { EmailSignupInput, containerVariants as emailInputVariants };
