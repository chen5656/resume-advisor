import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    annotations: defineTable({
        resumeId: v.string(),
        shapes: v.string(), // JSON string of Shape[]
        timestamp: v.number(),
    }).index("by_resumeId", ["resumeId"]),
});
