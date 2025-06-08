-- CreateTable
CREATE TABLE `Agent` (
    `AgentId` INTEGER NOT NULL AUTO_INCREMENT,
    `AwsId` VARCHAR(255) NULL,
    `UserRoleId` INTEGER NULL,

    INDEX `UserRoleId`(`UserRoleId`),
    PRIMARY KEY (`AgentId`)
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
    `UserCountry` VARCHAR(255) NULL,
    `ContactLink` VARCHAR(255) NULL,
    `AgentId` INTEGER NULL,
    `CardID` INTEGER NULL,

    INDEX `AgentId`(`AgentId`),
    PRIMARY KEY (`CustomerId`)
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
CREATE TABLE `Note` (
    `NoteID` INTEGER NOT NULL AUTO_INCREMENT,
    `Note` VARCHAR(255) NULL,
    `Date` DATE NULL,
    `AgentID` INTEGER NULL,

    INDEX `AgentID`(`AgentID`),
    PRIMARY KEY (`NoteID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScreenShot` (
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
    `LogDate` TIMESTAMP(0) NULL,

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
    `PaymentCheckTime` TIMESTAMP(0) NULL,
    `NoteID` INTEGER NULL,
    `TransactionDate` TIMESTAMP(0) NULL,
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
ALTER TABLE `FormStatus` ADD CONSTRAINT `formstatus_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `Transactions`(`TransactionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `FormStatus` ADD CONSTRAINT `formstatus_ibfk_2` FOREIGN KEY (`TransactionStatusID`) REFERENCES `TransactionStatus`(`TransactionStatusID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `note_ibfk_1` FOREIGN KEY (`AgentID`) REFERENCES `Agent`(`AgentId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ScreenShot` ADD CONSTRAINT `screenshot_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `Transactions`(`TransactionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

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

