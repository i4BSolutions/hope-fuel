import { z } from "zod";

export const CreateFormSchema = z.object({

  AgentId: z.number().min(1, { message: "Agent ID is required" }),

  SupportRegionId: z.number(),

  ManyChatId: z
    .string()
    .regex(/^\d+$/, { message: "ManyChat ID must be a numeric value" })
    .transform(Number) // Converts it to a number
    .refine((n) => n >= 1, { message: "ManyChat ID must be at least 1" }),

  ContactLink: z.string().url({ message: "Invalid URL format" }),

  Amount: z
    .string()
    .regex(/^\d+(\.\d{0,2})?$/, {
      message: "Amount must be a valid number with up to 2 decimal places",
    })
    .transform(Number) // Convert it to a number after validation
    .refine((n) => n >= 0.01, { message: "Amount must be greater than 0" }),

  Month: z
    .string()
    .min(1, { message: "Month is required" })
    .transform(Number) // Convert to number
    .refine((n) => n >= 1 && n <= 12, {
      message: "Month must be between 1 and 12",
    }),

  Notes: z.string().optional(),

  WalletId: z.number(),

  ScreenShots: z
    .array(z.string())
    .min(1, { message: "You need to provide a screenshot" }),
});
