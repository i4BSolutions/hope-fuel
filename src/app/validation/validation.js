import { z } from "zod";

export const submitPaymentSchema = z.object({
  customerName : z.string().min(1,{ message : "Customer name is required"}).max(255, { message: "Name must be less than 255 characters" }),
  customerEmail: z.string().email({ message: "Invalid email address" }),
  agentId : z.number(),
  supportRegionId: z.number(),
  manyChatId: z.string().min(1, { message: "ManyChat ID is required" }),
  contactLink: z.string().url({ message: "Invalid URL format" }),
  amount : z.number()
            .min(0.01, { message: "Amount must be greater than 0" })
            .regex(/^\d+(\.\d{0,2})?$/, { message: "Amount must be a valid number" }),
            
  month : z.number().int().min(1, { message: "Month must be greater than 0" }),
  note : z.string().optional(),
  walletId : z.number(),
  screenShot: z.array(z.string()).min(1, { message: "You need to provide a screenshot" }),
});

