import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
    args: { resumeId: v.string(), shapes: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("annotations")
            .withIndex("by_resumeId", (q) => q.eq("resumeId", args.resumeId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { shapes: args.shapes, timestamp: Date.now() });
        } else {
            await ctx.db.insert("annotations", {
                resumeId: args.resumeId,
                shapes: args.shapes,
                timestamp: Date.now()
            });
        }
    },
});

export const load = query({
    args: { resumeId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("annotations")
            .withIndex("by_resumeId", (q) => q.eq("resumeId", args.resumeId))
            .first();
    },
});
