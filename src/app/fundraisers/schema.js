export const FundraisingSchema = z.object({
  FundariserName: z.string().min(3, "Name must be at least 3 characters"),
  FundraiserId: z
    .string()
    .min(5, "Fundraiser ID must be at least 5 characters"),
  BaseCountryName: z.string().nonempty("Country is required"),
  AcceptedCurrencies: z.string().nonempty("Accepted currency is required"),
  FundraiserEmail: z.string().email("Invalid email address"),
  FacebookLink: z.string().url("Invalid Facebook URL").optional(),
  TelegramLink: z.string().url("Invalid Telegram URL").optional(),
  otherLink1: z.string().url("Invalid URL").optional(),
  otherLink2: z.string().url("Invalid URL").optional(),
  logo: z.any().optional(),
});
