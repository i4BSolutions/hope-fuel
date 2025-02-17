import { z } from "zod";

export const CreateFormSchema = z.object({
  customerName: z
    .string()
    .min(1, { message: "Customer name is required" })
    .max(255, { message: "Name must be less than 255 characters" }),

  customerEmail: 
    z.string().email({ message: "Invalid email address" }),

  agentId: z.number().min(1, { message: "Agent ID is required" }),

  supportRegionId: z.number(),

  manyChatId: z
    .string()
    .regex(/^\d+$/, { message: "ManyChat ID must be a numeric value" })
    .transform(Number) // Converts it to a number
    .refine((n) => n >= 1, { message: "ManyChat ID must be at least 1" }),

  contactLink: z.string().url({ message: "Invalid URL format" }),

  amount: z
    .string()
    .regex(/^\d+(\.\d{0,2})?$/, {
      message: "Amount must be a valid number with up to 2 decimal places",
    })
    .transform(Number) // Convert it to a number after validation
    .refine((n) => n >= 0.01, { message: "Amount must be greater than 0" }),

  month: z
    .string()
    .min(1, { message: "Month is required" })
    .transform(Number) // Convert to number
    .refine((n) => n >= 1 && n <= 12, {
      message: "Month must be between 1 and 12",
    }),

  note: z.string().optional(),

  walletId: z.number(),
  
  screenShot: z
    .array(z.string())
    .min(1, { message: "You need to provide a screenshot" }),
});
