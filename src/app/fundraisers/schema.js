import { z } from "zod";
export const FundraisingSchema = z
  .object({
    FundraiserName: z.string().min(3, "Name must be at least 3 characters"),
    FundraiserCentralID: z
      .number("Fundraiser ID is required")
      .min(3, "Fundraiser ID must be numeric"),
     
    BaseCountryName: z.string().nonempty("Country is required"),
    AcceptedCurrencies: z
      .array(z.string())
      .nonempty("Accepted currency is required"),
    FundraiserEmail: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    FacebookLink: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
    TelegramLink: z.string().url("Invalid Telegram URL").optional().or(z.literal("")),
    OtherLink1: z.string().url("Invalid URL").optional().or(z.literal("")),
    OtherLink2: z.string().url("Invalid URL").optional().or(z.literal("")),
    FundraiserLogo: z.string().nonempty("Please upload a logo"),
    NewCountry: z.string().optional(),
  })
  .superRefine(({ BaseCountryName, NewCountry }, ctx) => {
    if (BaseCountryName === "other" && (!NewCountry || !NewCountry.trim())) {
      ctx.addIssue({
        path: ["NewCountry"],
        message: "Please enter a new country",
        code: "custom",
      });
    }
  });