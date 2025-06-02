-- AlterTable
ALTER TABLE `CSVExportTransactionLogs` ADD COLUMN `FromDate` DATE NULL,
    ADD COLUMN `ToDate` DATE NULL;

-- AddForeignKey
ALTER TABLE `Fundraiser_ContactLinks` ADD CONSTRAINT `fundraiser_contactlinks_ibfk_2` FOREIGN KEY (`PlatformID`) REFERENCES `Platform`(`PlatformID`) ON DELETE CASCADE ON UPDATE RESTRICT;
