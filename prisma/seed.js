const { PrismaClient } = require("../generated/prisma/index.js");
const prisma = new PrismaClient();

async function main() {
  const userRoles = ["SUPPORT_AGENT", "ADMIN", "PAYMENT_CHECKER"];
  const userRoleRecords = [];
  for (const role of userRoles) {
    const record = await prisma.userRole.create({ data: { UserRole: role } });
    userRoleRecords.push(record);
  }

  const groupA = await prisma.agentGroup.upsert({
    where: { GroupName: "Group A" },
    update: {},
    create: { GroupName: "Group A" },
  });

  const groupB = await prisma.agentGroup.upsert({
    where: { GroupName: "Group B" },
    update: {},
    create: { GroupName: "Group B" },
  });

  const agentGroupData = [
    {
      group: groupA,
      agents: [
        "Agent Mg Mg",
        "Agent Aung Aung",
        "Agent Ko Ko",
        "Agent Nyi Nyi",
      ],
    },
    {
      group: groupB,
      agents: ["Agent Ma Ma", "Agent Phyu Phyu", "Agent Hla Hla"],
    },
  ];

  const agentRecords = [];
  for (const { group, agents } of agentGroupData) {
    for (const name of agents) {
      const agentRecord = await prisma.agent.upsert({
        where: { AwsId: name },
        update: { AgentGroupId: group.AgentGroupID },
        create: {
          AwsId: name,
          AgentGroupId: group.AgentGroupID,
          Username: name,
        },
      });
      agentRecords.push(agentRecord);
    }
  }

  const transactionStatuses = [
    "Form Entry",
    "Payment Checked",
    "Card Issued",
    "Cancel",
  ];

  const transactionStatusRecords = [];
  for (const status of transactionStatuses) {
    const record = await prisma.transactionStatus.upsert({
      where: { TransactionStatus: status },
      update: {},
      create: { TransactionStatus: status },
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

  const customersData = [
    {
      Name: "Customer10",
      Email: "customer10@example.com",
      ManyChatId: "864044484",
      ContactLink: "https://manychat.com/profile/49450",
      ExpireDate: new Date("2025-01-31"),
      CardID: 1234567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2024-12-25"),
      EndDate: new Date("2025-01-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer11",
      Email: "customer11@example.com",
      ManyChatId: "1840497169",
      ContactLink: "https://manychat.com/profile/65928",
      ExpireDate: new Date("2025-03-31"),
      CardID: 2234567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-02-05"),
      EndDate: new Date("2025-03-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink: "/screenshots/Customer11_payment.png",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer12",
      Email: "customer12@example.com",
      ManyChatId: "6807810221",
      ContactLink: "https://manychat.com/profile/89308",
      ExpireDate: new Date("2025-05-31"),
      CardID: 3234567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-02-15"),
      EndDate: new Date("2025-05-31"),
      Amount: 100,
      Month: 3,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer20",
      Email: "customer20@example.com",
      ManyChatId: "4315057941",
      ContactLink: "https://manychat.com/profile/24320",
      ExpireDate: new Date("2025-02-28"),
      CardID: 4234567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-01-25"),
      EndDate: new Date("2025-02-28"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer21",
      Email: "customer21@example.com",
      ManyChatId: "9972215262",
      ContactLink: "https://manychat.com/profile/10584",
      ExpireDate: new Date("2025-05-30"),
      CardID: 5234567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-25"),
      EndDate: new Date("2025-05-30"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer22",
      Email: "customer22@example.com",
      ManyChatId: "6304909841",
      ContactLink: "https://manychat.com/profile/10856",
      ExpireDate: new Date("2025-05-30"),
      CardID: 6234567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-25"),
      EndDate: new Date("2025-05-30"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer30",
      Email: "customer30@example.com",
      ManyChatId: "3883120514",
      ContactLink: "https://manychat.com/profile/54838",
      ExpireDate: new Date("2025-01-31"),
      CardID: 7234567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2024-12-02"),
      EndDate: new Date("2025-01-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer31",
      Email: "customer31@example.com",
      ManyChatId: "9048788580",
      ContactLink: "https://manychat.com/profile/11875",
      ExpireDate: new Date("2025-03-31"),
      CardID: 8234567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-02-21"),
      EndDate: new Date("2025-03-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer32",
      Email: "customer32@example.com",
      ManyChatId: "5466333158",
      ContactLink: "https://manychat.com/profile/48744",
      ExpireDate: new Date("2025-03-31"),
      CardID: 9234567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-02-25"),
      EndDate: new Date("2025-03-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer40",
      Email: "customer40@example.com",
      ManyChatId: "5393685617",
      ContactLink: "https://manychat.com/profile/82834",
      ExpireDate: new Date("2025-03-31"),
      CardID: 1334567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-02-20"),
      EndDate: new Date("2025-03-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer41",
      Email: "customer41@example.com",
      ManyChatId: "8658888190",
      ContactLink: "https://manychat.com/profile/46387",
      ExpireDate: new Date("2025-05-31"),
      CardID: 1434567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-12"),
      EndDate: new Date("2025-05-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer42",
      Email: "customer42@example.com",
      ManyChatId: "2694923281",
      ContactLink: "https://manychat.com/profile/74658",
      ExpireDate: new Date("2025-06-30"),
      CardID: 1534567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-25"),
      EndDate: new Date("2025-06-30"),
      Amount: 100,
      Month: 2,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer50",
      Email: "customer50@example.com",
      ManyChatId: "6016816124",
      ContactLink: "https://manychat.com/profile/25702",
      ExpireDate: new Date("2025-04-31"),
      CardID: 1634567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-03-27"),
      EndDate: new Date("2025-04-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer51",
      Email: "customer51@example.com",
      ManyChatId: "7418908216",
      ContactLink: "https://manychat.com/profile/81868",
      ExpireDate: new Date("2025-05-31"),
      CardID: 1734567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-25"),
      EndDate: new Date("2025-05-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer52",
      Email: "customer52@example.com",
      ManyChatId: "4695428623",
      ContactLink: "https://manychat.com/profile/59636",
      ExpireDate: new Date("2025-04-30"),
      CardID: 1834567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-03-11"),
      EndDate: new Date("2025-04-30"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer60",
      Email: "customer60@example.com",
      ManyChatId: "1116868784",
      ContactLink: "https://manychat.com/profile/48245",
      ExpireDate: new Date("2025-04-30"),
      CardID: 1934567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-02-20"),
      EndDate: new Date("2025-04-30"),
      Amount: 100,
      Month: 2,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer61",
      Email: "customer61@example.com",
      ManyChatId: "2859651193",
      ContactLink: "https://manychat.com/profile/48511",
      ExpireDate: new Date("2025-04-30"),
      CardID: 1244567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2024-04-25"),
      EndDate: new Date("2025-04-30"),
      Amount: 100,
      Month: 12,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer62",
      Email: "customer62@example.com",
      ManyChatId: "7776947371",
      ContactLink: "https://manychat.com/profile/73176",
      ExpireDate: new Date("2025-05-31"),
      CardID: 1254567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-25"),
      EndDate: new Date("2025-05-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer70",
      Email: "customer70@example.com",
      ManyChatId: "8712882385",
      ContactLink: "https://manychat.com/profile/94312",
      ExpireDate: new Date("2025-05-31"),
      CardID: 1264567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-12"),
      EndDate: new Date("2025-05-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer71",
      Email: "customer71@example.com",
      ManyChatId: "5579354065",
      ContactLink: "https://manychat.com/profile/12400",
      ExpireDate: new Date("2025-06-30"),
      CardID: 1274567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-25"),
      EndDate: new Date("2025-06-30"),
      Amount: 100,
      Month: 2,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer72",
      Email: "customer72@example.com",
      ManyChatId: "2131248826",
      ContactLink: "https://manychat.com/profile/24046",
      ExpireDate: new Date("2025-05-31"),
      CardID: 1284567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-25"),
      EndDate: new Date("2025-05-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer80",
      Email: "customer80@example.com",
      ManyChatId: "6788107872",
      ContactLink: "https://manychat.com/profile/27272",
      ExpireDate: new Date("2025-05-31"),
      CardID: 1294567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-04-15"),
      EndDate: new Date("2025-05-31"),
      Amount: 100,
      Month: 1,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer81",
      Email: "customer81@example.com",
      ManyChatId: "5971523959",
      ContactLink: "https://manychat.com/profile/71644",
      ExpireDate: new Date("2025-08-30"),
      CardID: 1235567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-05-01"),
      EndDate: new Date("2025-08-30"),
      Amount: 100,
      Month: 3,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
    {
      Name: "Customer100",
      Email: "customer100@gmail.com",
      ManyChatId: " 5971523959",
      ContactLink: "https://manychat.com/profile/71644",
      ExpireDate: new Date("2025-03-31"),
      CardID: 1236567,
      UserCountry: baseCountryRecords.find(
        (c) => c.BaseCountryName === "Singapore"
      ).BaseCountryID,
      StartDate: new Date("2025-01-23"),
      EndDate: new Date("2025-03-31"),
      Amount: 100,
      Month: 2,
      ScreenShotLink:
        "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com/public/7744ecb2-ef90-4c34-aabb-6fc77d0b54bb86d3e24b8647e52cc6c815a52ff6e445.jpg",
      Note: "Testing customers data!",
    },
  ];

  for (const customer of customersData) {
    const randomWalletId =
      walletRecords[Math.floor(Math.random() * walletRecords.length)].WalletId;
    const randomAgentId =
      agentRecords[Math.floor(Math.random() * agentRecords.length)].AgentId;

    const prismaCustomer = await prisma.customer.create({
      data: {
        Name: customer.Name,
        Email: customer.Email,
        ManyChatId: customer.ManyChatId,
        ContactLink: customer.ContactLink,
        ExpireDate: customer.ExpireDate,
        CardID: customer.CardID,
        BaseCountry: {
          connect: {
            BaseCountryID: customer.UserCountry,
          },
        },
        Agent: {
          connect: {
            AgentId: randomAgentId,
          },
        },
      },
    });

    const note = await prisma.note.create({
      data: {
        Note: "Tesing customers data!",
        Date: customer.StartDate,
        AgentID: randomAgentId,
      },
    });

    const transaction = await prisma.transactions.create({
      data: {
        CustomerID: prismaCustomer.CustomerId,
        Amount: 100,
        SupportRegionID: supportRegionRecords.find(
          (s) => s.Region === "North America"
        ).SupportRegionID,
        WalletID: randomWalletId,
        TransactionDate: customer.StartDate,
        NoteID: note.NoteID,
        Month: customer.Month,
        HopeFuelID: Math.floor(100000 + Math.random() * 900000),
      },
    });

    await prisma.subscription.create({
      data: {
        CustomerID: prismaCustomer.CustomerId,
        StartDate: customer.StartDate,
        EndDate: customer.EndDate,
      },
    });

    await prisma.screenShot.create({
      data: {
        TransactionID: transaction.TransactionID,
        ScreenShotLink: customer.ScreenShotLink,
      },
    });

    await prisma.formStatus.create({
      data: {
        TransactionID: transaction.TransactionID,
        TransactionStatusID: transactionStatusRecords.find(
          (s) => s.TransactionStatus === "Form Entry"
        ).TransactionStatusID,
      },
    });

    await prisma.transactionAgent.create({
      data: {
        TransactionID: transaction.TransactionID,
        AgentID: randomAgentId,
        LogDate: customer.StartDate,
      },
    });
  }

  await prisma.platform.createMany({
    data: [{ PlatformName: "Facebook" }, { PlatformName: "Telegram" }],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
