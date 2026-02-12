import { z } from "zod";

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(120),
    message: z.string().trim().min(20).max(2_000),
    company: z.string().trim().max(120).optional().default(""),
  })
  .strict();

export type ContactFormPayload = z.infer<typeof contactFormSchema>;
