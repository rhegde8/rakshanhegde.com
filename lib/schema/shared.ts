import { z } from "zod";

export const slugSchema = z
  .string()
  .min(2)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase kebab-case.",
  });

export const isoDateFromYamlSchema = z
  .union([z.string(), z.date()])
  .transform((value) => (value instanceof Date ? value.toISOString() : value))
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Date must be ISO compatible.",
  });

export function uniqueLowercaseList(name: string): z.ZodType<string[]> {
  return z
    .array(z.string().trim().min(1))
    .min(1, `${name} cannot be empty`)
    .transform((items) => [...new Set(items.map((item) => item.toLowerCase()))]);
}
