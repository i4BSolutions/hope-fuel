const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const userRoles = ["SUPPORT_AGENT", "ADMIN", "PAYMENT_CHECKER"];
  const userRoleRecords = [];
  for (const role of userRoles) {
    const record = await prisma.userRole.create({ data: { UserRole: role } });
    userRoleRecords.push(record);
  }

  const transactionStatuses = [
    "Form Entry",
    "Payment Checked",
    "Card Issued",
    "Cancel",
  ];
  const transactionStatusRecords = [];
  for (const status of transactionStatuses) {
    const record = await prisma.transactionStatus.create({
      data: { TransactionStatus: status },
    });
    transactionStatusRecords.push(record);
  }

  const currencies = [
    "USD",
    "EUR",
    "JPY",
    "AUD",
    "CNY",
    "CZK",
    "HKD",
    "IDR",
    "MYR",
    "MMK",
    "NOK",
    "NZD",
    "PHP",
    "SGD",
    "KRW",
    "TWD",
    "THB",
    "AED",
    "GBP",
    "VND",
    "CAD",
    "MOP",
    "CHF",
    "DKK",
    "BND",
    "INR",
    "SEK",
  ];
  const currencyRecords = [];
  for (const currency of currencies) {
    const record = await prisma.currency.create({
      data: { CurrencyCode: currency },
    });
    currencyRecords.push(record);
  }

  const baseCountries = [
    "USA",
    "UK",
    "Japan",
    "Australia",
    "China",
    "Czech Republic",
    "Finland",
    "France",
    "Hong Kong",
    "Indonesia",
    "Malaysia",
    "Myanmar",
    "Norway",
    "Netherlands",
    "New Zealand",
    "Philippines",
    "Singapore",
    "South Korea",
    "Taiwan",
    "Thailand",
    "United Arab Emirates",
    "Vietnam",
    "Canada",
    "Macau",
    "Switzerland",
    "Denmark",
    "Brunei",
    "India",
    "Sweden",
  ];
  const baseCountryRecords = [];

  for (const country of baseCountries) {
    const record = await prisma.baseCountry.upsert({
      where: { BaseCountryName: country },
      update: {},
      create: { BaseCountryName: country },
    });
    baseCountryRecords.push(record);
  }

  const customWallets = [
    { WalletName: "Personal Wallet", CurrencyId: 1 },
    { WalletName: "Business Wallet", CurrencyId: 2 },
    { WalletName: "Savings Wallet", CurrencyId: 3 },
  ];
  const wallets = currencies.map((code, i) => ({
    WalletName: `${code} Wallet`,
    CurrencyId: currencyRecords[i].CurrencyId,
  }));
  const walletRecords = [];
  for (const wallet of [...customWallets, ...wallets]) {
    const record = await prisma.wallet.create({
      data: {
        WalletName: wallet.WalletName,
        Currency: { connect: { CurrencyId: wallet.CurrencyId } },
      },
    });
    walletRecords.push(record);
  }

  const currencyCountryRateToUSD = [
    { country: "United States", code: "USD", rate: 1.0 },
    { country: "Eurozone", code: "EUR", rate: 1.08 },
    { country: "Japan", code: "JPY", rate: 0.0066 },
    { country: "Australia", code: "AUD", rate: 0.66 },
    { country: "China", code: "CNY", rate: 0.14 },
    { country: "Czech Republic", code: "CZK", rate: 0.043 },
    { country: "Hong Kong", code: "HKD", rate: 0.13 },
    { country: "Indonesia", code: "IDR", rate: 0.000065 },
    { country: "Malaysia", code: "MYR", rate: 0.21 },
    { country: "Myanmar", code: "MMK", rate: 0.00048 },
    { country: "Norway", code: "NOK", rate: 0.092 },
    { country: "New Zealand", code: "NZD", rate: 0.6 },
    { country: "Philippines", code: "PHP", rate: 0.018 },
    { country: "Singapore", code: "SGD", rate: 0.74 },
    { country: "South Korea", code: "KRW", rate: 0.00073 },
    { country: "Taiwan", code: "TWD", rate: 0.031 },
    { country: "Thailand", code: "THB", rate: 0.027 },
    { country: "United Arab Emirates", code: "AED", rate: 0.27 },
    { country: "United Kingdom", code: "GBP", rate: 1.25 },
    { country: "Vietnam", code: "VND", rate: 0.000042 },
    { country: "Canada", code: "CAD", rate: 0.73 },
    { country: "Macau", code: "MOP", rate: 0.12 },
    { country: "Switzerland", code: "CHF", rate: 1.11 },
    { country: "Denmark", code: "DKK", rate: 0.14 },
    { country: "Brunei", code: "BND", rate: 0.74 },
    { country: "India", code: "INR", rate: 0.012 },
    { country: "Sweden", code: "SEK", rate: 0.093 },
  ];

  for (const entry of currencyCountryRateToUSD) {
    const baseCountry = baseCountryRecords.find(
      (b) => b.BaseCountryName === entry.country
    );
    const currency = currencyRecords.find((c) => c.CurrencyCode === entry.code);
    const usdCurrency = currencyRecords.find((c) => c.CurrencyCode === "USD");

    if (!baseCountry || !currency || !usdCurrency) continue;

    await prisma.exchangeRates.create({
      data: {
        BaseCountryId: baseCountry.BaseCountryID,
        CurrencyId: usdCurrency.CurrencyId,
        ExchangeRate: parseFloat((1 / entry.rate).toFixed(5)),
      },
    });
  }

  const supportRegions = ["North America", "Europe", "Asia"];
  const supportRegionRecords = [];
  for (const region of supportRegions) {
    const record = await prisma.supportRegion.create({
      data: { Region: region },
    });
    supportRegionRecords.push(record);
  }

  const platforms = [];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
