-- Create missing tables

CREATE TABLE `BaseCountry` (
    `BaseCountryID` INTEGER NOT NULL AUTO_INCREMENT,
    `BaseCountryName` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `BaseCountryName`(`BaseCountryName`),
    PRIMARY KEY (`BaseCountryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

CREATE TABLE `FormVisibilityStatus` (
    `VisibilityStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `AgentId` INTEGER NOT NULL,
    `IsFormOpen` BOOLEAN NOT NULL,
    `FormTimeStamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    INDEX `AgentId`(`AgentId`),
    PRIMARY KEY (`VisibilityStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

CREATE TABLE `Fundraiser_AcceptedCurrencies` (
    `FundraiserAcceptedCurrencyID` INTEGER NOT NULL AUTO_INCREMENT,
    `FundraiserID` INTEGER NULL,
    `CurrencyID` INTEGER NULL,
    INDEX `CurrencyID`(`CurrencyID`),
    INDEX `FundraiserID`(`FundraiserID`),
    PRIMARY KEY (`FundraiserAcceptedCurrencyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Fundraiser_Contactlinks` (
    `ContactID` INTEGER NOT NULL AUTO_INCREMENT,
    `FundraiserID` INTEGER NULL,
    `PlatformID` INTEGER NULL,
    `ContactURL` VARCHAR(255) NOT NULL,
    INDEX `FundraiserID`(`FundraiserID`),
    PRIMARY KEY (`ContactID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ManyChat` (
    `ManyChatId` INTEGER NOT NULL AUTO_INCREMENT,
    `ConversationId` VARCHAR(255) NOT NULL,
    `CustomerId` INTEGER NOT NULL,
    `CreateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    INDEX `fk_manychat_customer`(`CustomerId`),
    PRIMARY KEY (`ManyChatId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `MinimumAmount` (
    `MinimumAmountId` INTEGER NOT NULL AUTO_INCREMENT,
    `CurrencyId` INTEGER NOT NULL,
    `Amount` DECIMAL(12, 2) NOT NULL,
    `CreateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    INDEX `CurrencyId`(`CurrencyId`),
    PRIMARY KEY (`MinimumAmountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Platform` (
    `PlatformID` INTEGER NOT NULL AUTO_INCREMENT,
    `PlatformName` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `PlatformName`(`PlatformName`),
    PRIMARY KEY (`PlatformID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add missing foreign keys

ALTER TABLE `Customer` ADD CONSTRAINT `BaseCountryID` FOREIGN KEY (`UserCountry`) REFERENCES `BaseCountry`(`BaseCountryID`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `CustomerAuditLogs` ADD CONSTRAINT `fk_agent` FOREIGN KEY (`AgentId`) REFERENCES `Agent`(`AgentId`) ON DELETE CASCADE ON UPDATE RESTRICT;
ALTER TABLE `CustomerAuditLogs` ADD CONSTRAINT `fk_customer` FOREIGN KEY (`CustomerId`) REFERENCES `Customer`(`CustomerId`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `ExchangeRates` ADD CONSTRAINT `fk_basecountry` FOREIGN KEY (`BaseCountryId`) REFERENCES `BaseCountry`(`BaseCountryID`) ON DELETE CASCADE ON UPDATE RESTRICT;
ALTER TABLE `ExchangeRates` ADD CONSTRAINT `fk_currency` FOREIGN KEY (`CurrencyId`) REFERENCES `Currency`(`CurrencyId`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `FormVisibilityStatus` ADD CONSTRAINT `formvisibilitystatus_ibfk_1` FOREIGN KEY (`AgentId`) REFERENCES `Agent`(`AgentId`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `Fundraiser` ADD CONSTRAINT `fundraiser_ibfk_1` FOREIGN KEY (`BaseCountryID`) REFERENCES `BaseCountry`(`BaseCountryID`) ON DELETE SET NULL ON UPDATE RESTRICT;

ALTER TABLE `Fundraiser_AcceptedCurrencies` ADD CONSTRAINT `fundraiser_acceptedcurrencies_ibfk_1` FOREIGN KEY (`FundraiserID`) REFERENCES `Fundraiser`(`FundraiserID`) ON DELETE CASCADE ON UPDATE RESTRICT;
ALTER TABLE `Fundraiser_AcceptedCurrencies` ADD CONSTRAINT `fundraiser_acceptedcurrencies_ibfk_2` FOREIGN KEY (`CurrencyID`) REFERENCES `Currency`(`CurrencyId`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `Fundraiser_Contactlinks` ADD CONSTRAINT `fundraiser_contactlinks_ibfk_1` FOREIGN KEY (`FundraiserID`) REFERENCES `Fundraiser`(`FundraiserID`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `ManyChat` ADD CONSTRAINT `fk_manychat_customer` FOREIGN KEY (`CustomerId`) REFERENCES `Customer`(`CustomerId`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `MinimumAmount` ADD CONSTRAINT `minimumamount_ibfk_1` FOREIGN KEY (`CurrencyId`) REFERENCES `Currency`(`CurrencyId`) ON DELETE CASCADE ON UPDATE RESTRICT;
