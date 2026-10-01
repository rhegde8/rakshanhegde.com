import { z } from "zod";

import { isoDateFromYamlSchema, slugSchema, uniqueLowercaseList } from "@/lib/schema/shared";

export const projectFrontmatterSchema = z
  .object({
    slug: slugSchema,
    title: z.string().trim().min(2),
    summary: z.string().trim().min(10),
    category: z.string().trim().min(2),
    context: z.string().trim().min(2),
    status: z.enum(["in-use", "ongoing"]),
    updatedAt: isoDateFromYamlSchema,
    stack: uniqueLowercaseList("stack", 0).optional().default([]),
    tags: uniqueLowercaseList("tags"),
    impact: z.string().trim().min(4),
    featured: z.boolean().optional().default(false),
    order: z.number().int().nonnegative(),
  })
  .strict();

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
