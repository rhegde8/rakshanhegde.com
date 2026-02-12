import { z } from "zod";

import { isoDateFromYamlSchema, slugSchema, uniqueLowercaseList } from "@/lib/schema/shared";

export const projectFrontmatterSchema = z
  .object({
    slug: slugSchema,
    title: z.string().trim().min(2),
    summary: z.string().trim().min(10),
    status: z.enum(["ongoing", "completed"]),
    startedAt: isoDateFromYamlSchema,
    updatedAt: isoDateFromYamlSchema,
    stack: uniqueLowercaseList("stack"),
    tags: uniqueLowercaseList("tags"),
    aiFocus: uniqueLowercaseList("aiFocus"),
    completedAt: isoDateFromYamlSchema.optional(),
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    demoVideoUrl: z.string().url().optional(),
    caseStudyUrl: z.string().url().optional(),
    impact: z.string().trim().min(4).optional(),
    role: z.string().trim().min(2).optional(),
    teamSize: z.number().int().positive().optional(),
    featured: z.boolean().optional().default(false),
  })
  .superRefine((project, context) => {
    if (project.status === "completed" && !project.completedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["completedAt"],
        message: "completedAt is required when status is completed.",
      });
    }
  })
  .strict();

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
