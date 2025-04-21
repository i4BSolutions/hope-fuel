-- CreateTable
CREATE TABLE `Agent` (
    `AgentId` INTEGER NOT NULL AUTO_INCREMENT,
    `AwsId` VARCHAR(255) NULL,
    `UserRoleId` INTEGER NULL,

    INDEX `UserRoleId`(`UserRoleId`),
    PRIMARY KEY (`AgentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BaseCountry` (
    `BaseCountryID` INTEGER NOT NULL AUTO_INCREMENT,
    `BaseCountryName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `BaseCountryName`(`BaseCountryName`),
    PRIMARY KEY (`BaseCountryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Currency` (
    `CurrencyId` INTEGER NOT NULL AUTO_INCREMENT,
    `CurrencyCode` VARCHAR(10) NULL,

    PRIMARY KEY (`CurrencyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `CustomerId` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NULL,
    `Email` VARCHAR(255) NULL,
    `ManyChatId` VARCHAR(255) NULL,
    `ExpireDate` DATE NULL,
    `UserCountry` INTEGER NULL,
    `ContactLink` VARCHAR(255) NULL,
    `AgentId` INTEGER NULL,
    `CardID` INTEGER NULL,

    INDEX `AgentId`(`AgentId`),
    INDEX `BaseCountryID`(`UserCountry`),
    PRIMARY KEY (`CustomerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerAuditLogs` (
    `LogId` INTEGER NOT NULL AUTO_INCREMENT,
    `AgentId` INTEGER NOT NULL,
    `FieldChanged` ENUM('Name', 'Email', 'UserCountry') NOT NULL,
    `OldValue` VARCHAR(255) NULL,
    `NewValue` VARCHAR(255) NULL,
    `CustomerId` INTEGER NOT NULL,
    `ChangeDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_agent`(`AgentId`),
    INDEX `fk_customer`(`CustomerId`),
    PRIMARY KEY (`LogId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExchangeRates` (
    `ExchangeRateId` INTEGER NOT NULL AUTO_INCREMENT,
    `BaseCountryId` INTEGER NOT NULL,
    `CurrencyId` INTEGER NOT NULL,
    `ExchangeRate` DECIMAL(12, 5) NOT NULL,
    `CreateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_basecountry`(`BaseCountryId`),
    INDEX `fk_currency`(`CurrencyId`),
    PRIMARY KEY (`ExchangeRateId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormStatus` (
    `FormStatusID` INTEGER NOT NULL AUTO_INCREMENT,
    `TransactionID` INTEGER NULL,
    `TransactionStatusID` INTEGER NULL,

    INDEX `TransactionID`(`TransactionID`),
    INDEX `TransactionStatusID`(`TransactionStatusID`),
    PRIMARY KEY (`FormStatusID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormVisibilityStatus` (
    `VisibilityStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `AgentId` INTEGER NOT NULL,
    `IsFormOpen` BOOLEAN NOT NULL,
    `FormTimeStamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `AgentId`(`AgentId`),
    PRIMARY KEY (`VisibilityStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fundraiser` (
    `FundraiserID` INTEGER NOT NULL AUTO_INCREMENT,
    `FundraiserName` VARCHAR(255) NOT NULL,
    `FundraiserEmail` VARCHAR(191) NOT NULL,
    `FundraiserLogo` VARCHAR(255) NULL,
    `BaseCountryID` INTEGER NULL,
    `FundraiserCentralID` INTEGER NULL,

    UNIQUE INDEX `FundraiserEmail`(`FundraiserEmail`),
    INDEX `BaseCountryID`(`BaseCountryID`),
    PRIMARY KEY (`FundraiserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fundraiser_AcceptedCurrencies` (
    `FundraiserAcceptedCurrencyID` INTEGER NOT NULL AUTO_INCREMENT,
    `FundraiserID` INTEGER NULL,
    `CurrencyID` INTEGER NULL,

    INDEX `CurrencyID`(`CurrencyID`),
    INDEX `FundraiserID`(`FundraiserID`),
    PRIMARY KEY (`FundraiserAcceptedCurrencyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fundraiser_Contactlinks` (
    `ContactID` INTEGER NOT NULL AUTO_INCREMENT,
    `FundraiserID` INTEGER NULL,
    `PlatformID` INTEGER NULL,
    `ContactURL` VARCHAR(255) NOT NULL,

    INDEX `FundraiserID`(`FundraiserID`),
    PRIMARY KEY (`ContactID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ManyChat` (
    `ManyChatId` INTEGER NOT NULL AUTO_INCREMENT,
    `ConversationId` VARCHAR(255) NOT NULL,
    `CustomerId` INTEGER NOT NULL,
    `CreateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_manychat_customer`(`CustomerId`),
    PRIMARY KEY (`ManyChatId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MinimumAmount` (
    `MinimumAmountId` INTEGER NOT NULL AUTO_INCREMENT,
    `CurrencyId` INTEGER NOT NULL,
    `Amount` DECIMAL(12, 2) NOT NULL,
    `CreateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `CurrencyId`(`CurrencyId`),
    PRIMARY KEY (`MinimumAmountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Note` (
    `NoteID` INTEGER NOT NULL AUTO_INCREMENT,
    `Note` VARCHAR(255) NULL,
    `Date` DATE NULL,
    `AgentID` INTEGER NULL,

    INDEX `AgentID`(`AgentID`),
    PRIMARY KEY (`NoteID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Platform` (
    `PlatformID` INTEGER NOT NULL AUTO_INCREMENT,
    `PlatformName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PlatformName`(`PlatformName`),
    PRIMARY KEY (`PlatformID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Screenshot` (
    `ScreenShotID` INTEGER NOT NULL AUTO_INCREMENT,
    `TransactionID` INTEGER NULL,
    `ScreenShotLink` VARCHAR(2048) NULL,

    INDEX `TransactionID`(`TransactionID`),
    PRIMARY KEY (`ScreenShotID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportRegion` (
    `SupportRegionID` INTEGER NOT NULL AUTO_INCREMENT,
    `Region` VARCHAR(255) NULL,

    PRIMARY KEY (`SupportRegionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionAgent` (
    `TransactionAgentID` INTEGER NOT NULL AUTO_INCREMENT,
    `TransactionID` INTEGER NULL,
    `AgentID` INTEGER NULL,
    `LogDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `AgentID`(`AgentID`),
    INDEX `TransactionID`(`TransactionID`),
    PRIMARY KEY (`TransactionAgentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `TransactionID` INTEGER NOT NULL AUTO_INCREMENT,
    `CustomerID` INTEGER NULL,
    `SupportRegionID` INTEGER NULL,
    `WalletID` INTEGER NULL,
    `Amount` FLOAT NULL,
    `PaymentCheck` BOOLEAN NULL,
    `PaymentCheckTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `NoteID` INTEGER NULL,
    `TransactionDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `PaymentDenied` BOOLEAN NULL,
    `Month` INTEGER NULL,
    `HopeFuelID` INTEGER NULL,

    INDEX `CustomerID`(`CustomerID`),
    INDEX `NoteID`(`NoteID`),
    INDEX `SupportRegionID`(`SupportRegionID`),
    INDEX `WalletID`(`WalletID`),
    PRIMARY KEY (`TransactionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionStatus` (
    `TransactionStatusID` INTEGER NOT NULL AUTO_INCREMENT,
    `TransactionStatus` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`TransactionStatusID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `UserRoleID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserRole` VARCHAR(255) NULL,

    PRIMARY KEY (`UserRoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `WalletId` INTEGER NOT NULL AUTO_INCREMENT,
    `CurrencyId` INTEGER NULL,
    `WalletName` VARCHAR(255) NULL,

    INDEX `CurrencyId`(`CurrencyId`),
    PRIMARY KEY (`WalletId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agent` ADD CONSTRAINT `agent_ibfk_1` FOREIGN KEY (`UserRoleId`) REFERENCES `UserRole`(`UserRoleID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`AgentId`) REFERENCES `Agent`(`AgentId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `BaseCountryID` FOREIGN KEY (`UserCountry`) REFERENCES `BaseCountry`(`BaseCountryID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerAuditLogs` ADD CONSTRAINT `fk_agent` FOREIGN KEY (`AgentId`) REFERENCES `Agent`(`AgentId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `CustomerAuditLogs` ADD CONSTRAINT `fk_customer` FOREIGN KEY (`CustomerId`) REFERENCES `Customer`(`CustomerId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ExchangeRates` ADD CONSTRAINT `fk_basecountry` FOREIGN KEY (`BaseCountryId`) REFERENCES `BaseCountry`(`BaseCountryID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ExchangeRates` ADD CONSTRAINT `fk_currency` FOREIGN KEY (`CurrencyId`) REFERENCES `Currency`(`CurrencyId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `FormStatus` ADD CONSTRAINT `formstatus_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `Transactions`(`TransactionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `FormStatus` ADD CONSTRAINT `formstatus_ibfk_2` FOREIGN KEY (`TransactionStatusID`) REFERENCES `TransactionStatus`(`TransactionStatusID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `FormVisibilityStatus` ADD CONSTRAINT `formvisibilitystatus_ibfk_1` FOREIGN KEY (`AgentId`) REFERENCES `Agent`(`AgentId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Fundraiser` ADD CONSTRAINT `fundraiser_ibfk_1` FOREIGN KEY (`BaseCountryID`) REFERENCES `BaseCountry`(`BaseCountryID`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Fundraiser_AcceptedCurrencies` ADD CONSTRAINT `fundraiser_acceptedcurrencies_ibfk_1` FOREIGN KEY (`FundraiserID`) REFERENCES `Fundraiser`(`FundraiserID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Fundraiser_AcceptedCurrencies` ADD CONSTRAINT `fundraiser_acceptedcurrencies_ibfk_2` FOREIGN KEY (`CurrencyID`) REFERENCES `Currency`(`CurrencyId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Fundraiser_Contactlinks` ADD CONSTRAINT `fundraiser_contactlinks_ibfk_1` FOREIGN KEY (`FundraiserID`) REFERENCES `Fundraiser`(`FundraiserID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ManyChat` ADD CONSTRAINT `fk_manychat_customer` FOREIGN KEY (`CustomerId`) REFERENCES `Customer`(`CustomerId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `MinimumAmount` ADD CONSTRAINT `minimumamount_ibfk_1` FOREIGN KEY (`CurrencyId`) REFERENCES `Currency`(`CurrencyId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `note_ibfk_1` FOREIGN KEY (`AgentID`) REFERENCES `Agent`(`AgentId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Screenshot` ADD CONSTRAINT `screenshot_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `Transactions`(`TransactionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `TransactionAgent` ADD CONSTRAINT `transactionagent_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `Transactions`(`TransactionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `TransactionAgent` ADD CONSTRAINT `transactionagent_ibfk_2` FOREIGN KEY (`AgentID`) REFERENCES `Agent`(`AgentId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `Customer`(`CustomerId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`SupportRegionID`) REFERENCES `SupportRegion`(`SupportRegionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`WalletID`) REFERENCES `Wallet`(`WalletId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`NoteID`) REFERENCES `Note`(`NoteID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`CurrencyId`) REFERENCES `Currency`(`CurrencyId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

