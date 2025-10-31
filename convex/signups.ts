import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createSignup = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Server-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email format");
    }

    // Check for duplicates using index (efficient)
    const existing = await ctx.db
      .query("signups")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    // Silent success for duplicates (UX-friendly)
    if (existing) {
      return { success: true, duplicate: true };
    }

    // Insert new signup
    await ctx.db.insert("signups", {
      email: args.email,
      source: "landing-page",
    });

    return { success: true, duplicate: false };
  },
});
