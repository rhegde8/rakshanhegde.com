import { z } from "zod";

import { isoDateFromYamlSchema, slugSchema, uniqueLowercaseList } from "@/lib/schema/shared";

export const writingFrontmatterSchema = z
  .object({
    slug: slugSchema,
    title: z.string().trim().min(2),
    summary: z.string().trim().min(10),
    updatedAt: isoDateFromYamlSchema,
    tags: uniqueLowercaseList("tags"),
    hypothesis: z.string().trim().min(5).optional(),
    findings: z.string().trim().min(5).optional(),
    references: z.array(z.string().url()).optional(),
    featured: z.boolean().optional().default(false),
  })
  .strict();

export type WritingFrontmatter = z.infer<typeof writingFrontmatterSchema>;
