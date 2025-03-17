import { z } from "zod";
export const FundraisingSchema = z.object({
  FundraiserName: z.string().min(3, "Name must be at least 3 characters"),
  // FundraiserCentralID: z
  //   .number()
  //   .min(5, "Fundraiser ID must be numeric"),
  BaseCountryName: z.string().nonempty("Country is required"),
 // AcceptedCurrencies: z.string().nonempty("Accepted currency is required"),
  FundraiserEmail: z.string().email("Invalid email address"),
//  FacebookLink: z.string().url("Invalid Facebook URL").optional(),
//  TelegramLink: z.string().url("Invalid Telegram URL").optional(),
 // otherLink1: z.string().url("Invalid URL").optional(),
 // otherLink2: z.string().url("Invalid URL").optional(),
  FundraiserLogo: z.string().nonempty("Please upload a logo"),
  NewCountry: z.string().nonempty("Please enter a new country"),
});
