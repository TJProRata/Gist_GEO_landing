"use client";

import Image from "next/image";
import { EmailSignupInput } from "@/components/email-signup-input";

export default function Home() {
  const handleSubmit = async (email: string) => {
    console.log("Email submitted:", email);
    // TODO: Connect to Convex backend
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleSuccess = () => {
    console.log("Subscription successful!");
  };

  const handleError = (error: string) => {
    console.error("Subscription error:", error);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-4 pt-[200px] md:px-20 md:py-20">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Main content container */}
      <div className="flex min-h-[calc(100vh-216px)] flex-col items-center justify-between md:min-h-[calc(100vh-160px)] md:justify-center">
        {/* Content sections */}
        <div className="flex w-full flex-col items-center gap-[100px]">
          {/* Hero section */}
          <div className="flex flex-col items-center gap-5 md:gap-8">
            {/* Coming soon + Title */}
            <div className="flex flex-col items-center gap-[14px] md:gap-7">
              {/* Coming soon */}
              <div className="flex flex-col justify-center text-center">
                <p className="text-[14px] font-medium italic leading-[16.52px] text-[#FFF5DC] md:text-[24px] md:leading-[28.32px]">
                  Coming soon
                </p>
              </div>

              {/* Gist GEO Title */}
              <div className="flex flex-col items-center gap-[26.33px] md:gap-10">
                <div className="flex flex-col justify-center text-center">
                  <h1 className="text-[48px] font-bold leading-[56.64px] md:text-[84px] md:leading-[99.12px]">
                    <span className="text-white/60">Gist</span>
                    <span className="text-[#FEFFCE]"> </span>
                    <span className="text-[rgba(254,255,205,0.60)]">GEO</span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div className="w-[300px] text-center text-[16px] font-medium leading-[22.40px] tracking-[0.16px] text-white/80 md:w-[652px] md:text-[24px] md:leading-[33.60px] md:tracking-[0.24px]">
              Surface your brand's coverage, gaps, and next best moves across
              ChatGPT, Perplexity, Claude, and more.
            </div>
          </div>

          {/* Signup section */}
          <div className="flex flex-col items-center gap-[14px] md:gap-5">
            <div className="text-[14px] font-medium tracking-[0.14px] text-white md:text-[20px] md:tracking-[0.20px]">
              Get notified when we launch.
            </div>
            <EmailSignupInput
              onSubmit={handleSubmit}
              onSuccess={handleSuccess}
              onError={handleError}
              responsive="mobile"
              className="md:w-[470px]"
            />
          </div>
        </div>

        {/* Footer - Copyright */}
        <div className="mt-4 flex flex-col justify-center text-center text-[12px] font-normal tracking-[0.12px] text-white/60 md:absolute md:bottom-[50px] md:right-[80px] md:mt-0 md:text-[14px] md:tracking-[0.14px]">
          © 2025 ProRata
        </div>
      </div>
    </main>
  );
}
