/*
  Warnings:

  - You are about to drop the `Fundraiser_Contactlinks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Fundraiser_Contactlinks` DROP FOREIGN KEY `fundraiser_contactlinks_ibfk_1`;

-- DropTable
DROP TABLE `Fundraiser_Contactlinks`;

-- CreateTable
CREATE TABLE `Fundraiser_ContactLinks` (
    `ContactID` INTEGER NOT NULL AUTO_INCREMENT,
    `FundraiserID` INTEGER NULL,
    `PlatformID` INTEGER NULL,
    `ContactURL` VARCHAR(255) NOT NULL,

    INDEX `FundraiserID`(`FundraiserID`),
    PRIMARY KEY (`ContactID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fundraiser_ContactLinks` ADD CONSTRAINT `fundraiser_contactlinks_ibfk_1` FOREIGN KEY (`FundraiserID`) REFERENCES `Fundraiser`(`FundraiserID`) ON DELETE CASCADE ON UPDATE RESTRICT;
