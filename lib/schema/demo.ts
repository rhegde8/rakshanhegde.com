import { z } from "zod";

import { isoDateFromYamlSchema, slugSchema, uniqueLowercaseList } from "@/lib/schema/shared";

export const demoFrontmatterSchema = z
  .object({
    slug: slugSchema,
    title: z.string().trim().min(2),
    summary: z.string().trim().min(10),
    updatedAt: isoDateFromYamlSchema,
    videoType: z.enum(["youtube", "vimeo", "local"]),
    videoUrl: z.string().trim().min(4),
    tags: uniqueLowercaseList("tags"),
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    status: z.enum(["ongoing", "completed"]).optional(),
    stack: uniqueLowercaseList("stack").optional(),
    aiFocus: uniqueLowercaseList("aiFocus").optional(),
    featured: z.boolean().optional().default(false),
  })
  .superRefine((entry, context) => {
    if (entry.videoType === "local" && !entry.videoUrl.startsWith("/")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["videoUrl"],
        message: "Local videos must use an absolute public path like /videos/demo.mp4.",
      });
    }

    if (entry.videoType !== "local" && !/^https?:\/\//.test(entry.videoUrl)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["videoUrl"],
        message: "Remote videos must use a valid http(s) URL.",
      });
    }
  })
  .strict();

export type DemoFrontmatter = z.infer<typeof demoFrontmatterSchema>;
