/*
  Warnings:

  - You are about to alter the column `UserCountry` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `UserCountry` INTEGER NULL;

-- CreateIndex
CREATE INDEX `BaseCountryID` ON `Customer`(`UserCountry`);

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `BaseCountryID` FOREIGN KEY (`UserCountry`) REFERENCES `BaseCountry`(`BaseCountryID`) ON DELETE SET NULL ON UPDATE CASCADE;
