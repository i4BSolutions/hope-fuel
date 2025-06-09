/*
  Warnings:

  - A unique constraint covering the columns `[TransactionStatus]` on the table `TransactionStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `AgentGroupId` INTEGER NULL;

-- CreateTable
CREATE TABLE `AgentGroup` (
    `AgentGroupID` INTEGER NOT NULL AUTO_INCREMENT,
    `GroupName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AgentGroup_GroupName_key`(`GroupName`),
    PRIMARY KEY (`AgentGroupID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `TransactionStatus_TransactionStatus_key` ON `TransactionStatus`(`TransactionStatus`);

-- AddForeignKey
ALTER TABLE `Agent` ADD CONSTRAINT `Agent_AgentGroupId_fkey` FOREIGN KEY (`AgentGroupId`) REFERENCES `AgentGroup`(`AgentGroupID`) ON DELETE SET NULL ON UPDATE CASCADE;
