-- CreateTable
CREATE TABLE `agent` (
    `AgentId` INTEGER NOT NULL AUTO_INCREMENT,
    `AwsId` VARCHAR(255) NULL,
    `UserRoleId` INTEGER NULL,

    INDEX `UserRoleId`(`UserRoleId`),
    PRIMARY KEY (`AgentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `basecountry` (
    `BaseCountryID` INTEGER NOT NULL AUTO_INCREMENT,
    `BaseCountryName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `BaseCountryName`(`BaseCountryName`),
    PRIMARY KEY (`BaseCountryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currency` (
    `CurrencyId` INTEGER NOT NULL AUTO_INCREMENT,
    `CurrencyCode` VARCHAR(10) NULL,

    PRIMARY KEY (`CurrencyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `CustomerId` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NULL,
    `Email` VARCHAR(255) NULL,
    `ManyChatId` VARCHAR(255) NULL,
    `ExpireDate` DATE NULL,
    `UserCountry` VARCHAR(255) NULL,
    `ContactLink` VARCHAR(255) NULL,
    `AgentId` INTEGER NULL,
    `CardID` INTEGER NULL,

    INDEX `AgentId`(`AgentId`),
    PRIMARY KEY (`CustomerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customerauditlogs` (
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
CREATE TABLE `exchangerates` (
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
CREATE TABLE `formstatus` (
    `FormStatusID` INTEGER NOT NULL AUTO_INCREMENT,
    `TransactionID` INTEGER NULL,
    `TransactionStatusID` INTEGER NULL,

    INDEX `TransactionID`(`TransactionID`),
    INDEX `TransactionStatusID`(`TransactionStatusID`),
    PRIMARY KEY (`FormStatusID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `formvisibilitystatus` (
    `VisibilityStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `AgentId` INTEGER NOT NULL,
    `IsFormOpen` BOOLEAN NOT NULL,
    `FormTimeStamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `AgentId`(`AgentId`),
    PRIMARY KEY (`VisibilityStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fundraiser` (
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
CREATE TABLE `fundraiser_acceptedcurrencies` (
    `FundraiserAcceptedCurrencyID` INTEGER NOT NULL AUTO_INCREMENT,
    `FundraiserID` INTEGER NULL,
    `CurrencyID` INTEGER NULL,

    INDEX `CurrencyID`(`CurrencyID`),
    INDEX `FundraiserID`(`FundraiserID`),
    PRIMARY KEY (`FundraiserAcceptedCurrencyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fundraiser_contactlinks` (
    `ContactID` INTEGER NOT NULL AUTO_INCREMENT,
    `FundraiserID` INTEGER NULL,
    `Platform` INTEGER NULL,
    `ContactURL` VARCHAR(255) NOT NULL,

    INDEX `FundraiserID`(`FundraiserID`),
    PRIMARY KEY (`ContactID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manychat` (
    `ManyChatId` INTEGER NOT NULL AUTO_INCREMENT,
    `ConversationId` VARCHAR(255) NOT NULL,
    `CustomerId` INTEGER NOT NULL,
    `CreateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_manychat_customer`(`CustomerId`),
    PRIMARY KEY (`ManyChatId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `minimumamount` (
    `MinimumAmountId` INTEGER NOT NULL AUTO_INCREMENT,
    `CurrencyId` INTEGER NOT NULL,
    `Amount` DECIMAL(12, 2) NOT NULL,
    `CreateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `CurrencyId`(`CurrencyId`),
    PRIMARY KEY (`MinimumAmountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `note` (
    `NoteID` INTEGER NOT NULL AUTO_INCREMENT,
    `Note` VARCHAR(255) NULL,
    `Date` DATE NULL,
    `AgentID` INTEGER NULL,

    INDEX `AgentID`(`AgentID`),
    PRIMARY KEY (`NoteID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `platform` (
    `PlatformID` INTEGER NOT NULL AUTO_INCREMENT,
    `PlatformName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PlatformName`(`PlatformName`),
    PRIMARY KEY (`PlatformID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `screenshot` (
    `ScreenShotID` INTEGER NOT NULL AUTO_INCREMENT,
    `TransactionID` INTEGER NULL,
    `ScreenShotLink` VARCHAR(2048) NULL,

    INDEX `TransactionID`(`TransactionID`),
    PRIMARY KEY (`ScreenShotID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supportregion` (
    `SupportRegionID` INTEGER NOT NULL AUTO_INCREMENT,
    `Region` VARCHAR(255) NULL,

    PRIMARY KEY (`SupportRegionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactionagent` (
    `TransactionAgentID` INTEGER NOT NULL AUTO_INCREMENT,
    `TransactionID` INTEGER NULL,
    `AgentID` INTEGER NULL,
    `LogDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `AgentID`(`AgentID`),
    INDEX `TransactionID`(`TransactionID`),
    PRIMARY KEY (`TransactionAgentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
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
CREATE TABLE `transactionstatus` (
    `TransactionStatusID` INTEGER NOT NULL AUTO_INCREMENT,
    `TransactionStatus` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`TransactionStatusID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userrole` (
    `UserRoleID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserRole` VARCHAR(255) NULL,

    PRIMARY KEY (`UserRoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet` (
    `WalletId` INTEGER NOT NULL AUTO_INCREMENT,
    `CurrencyId` INTEGER NULL,
    `WalletName` VARCHAR(255) NULL,

    INDEX `CurrencyId`(`CurrencyId`),
    PRIMARY KEY (`WalletId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `agent` ADD CONSTRAINT `agent_ibfk_1` FOREIGN KEY (`UserRoleId`) REFERENCES `userrole`(`UserRoleID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customer` ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`AgentId`) REFERENCES `agent`(`AgentId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customerauditlogs` ADD CONSTRAINT `fk_agent` FOREIGN KEY (`AgentId`) REFERENCES `agent`(`AgentId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customerauditlogs` ADD CONSTRAINT `fk_customer` FOREIGN KEY (`CustomerId`) REFERENCES `customer`(`CustomerId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `exchangerates` ADD CONSTRAINT `fk_basecountry` FOREIGN KEY (`BaseCountryId`) REFERENCES `basecountry`(`BaseCountryID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `exchangerates` ADD CONSTRAINT `fk_currency` FOREIGN KEY (`CurrencyId`) REFERENCES `currency`(`CurrencyId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `formstatus` ADD CONSTRAINT `formstatus_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `transactions`(`TransactionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `formstatus` ADD CONSTRAINT `formstatus_ibfk_2` FOREIGN KEY (`TransactionStatusID`) REFERENCES `transactionstatus`(`TransactionStatusID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `formvisibilitystatus` ADD CONSTRAINT `formvisibilitystatus_ibfk_1` FOREIGN KEY (`AgentId`) REFERENCES `agent`(`AgentId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fundraiser` ADD CONSTRAINT `fundraiser_ibfk_1` FOREIGN KEY (`BaseCountryID`) REFERENCES `basecountry`(`BaseCountryID`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fundraiser_acceptedcurrencies` ADD CONSTRAINT `fundraiser_acceptedcurrencies_ibfk_1` FOREIGN KEY (`FundraiserID`) REFERENCES `fundraiser`(`FundraiserID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fundraiser_acceptedcurrencies` ADD CONSTRAINT `fundraiser_acceptedcurrencies_ibfk_2` FOREIGN KEY (`CurrencyID`) REFERENCES `currency`(`CurrencyId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fundraiser_contactlinks` ADD CONSTRAINT `fundraiser_contactlinks_ibfk_1` FOREIGN KEY (`FundraiserID`) REFERENCES `fundraiser`(`FundraiserID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `manychat` ADD CONSTRAINT `fk_manychat_customer` FOREIGN KEY (`CustomerId`) REFERENCES `customer`(`CustomerId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `minimumamount` ADD CONSTRAINT `minimumamount_ibfk_1` FOREIGN KEY (`CurrencyId`) REFERENCES `currency`(`CurrencyId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_ibfk_1` FOREIGN KEY (`AgentID`) REFERENCES `agent`(`AgentId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `screenshot` ADD CONSTRAINT `screenshot_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `transactions`(`TransactionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactionagent` ADD CONSTRAINT `transactionagent_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `transactions`(`TransactionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactionagent` ADD CONSTRAINT `transactionagent_ibfk_2` FOREIGN KEY (`AgentID`) REFERENCES `agent`(`AgentId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer`(`CustomerId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`SupportRegionID`) REFERENCES `supportregion`(`SupportRegionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`WalletID`) REFERENCES `wallet`(`WalletId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`NoteID`) REFERENCES `note`(`NoteID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `wallet` ADD CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`CurrencyId`) REFERENCES `currency`(`CurrencyId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

