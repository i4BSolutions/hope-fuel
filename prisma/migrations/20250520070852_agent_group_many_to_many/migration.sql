/*
  Warnings:

  - You are about to drop the column `AgentId` on the `AgentGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Agent` DROP FOREIGN KEY `Agent_AgentGroupId_fkey`;

-- DropIndex
DROP INDEX `Agent_AgentGroupId_fkey` ON `Agent`;

-- DropIndex
DROP INDEX `AgentId` ON `AgentGroup`;

-- AlterTable
ALTER TABLE `AgentGroup` DROP COLUMN `AgentId`;

-- CreateTable
CREATE TABLE `AssignedAgent` (
    `AssignedAgentId` INTEGER NOT NULL AUTO_INCREMENT,
    `AgentId` INTEGER NOT NULL,
    `AgentGroupID` INTEGER NOT NULL,

    UNIQUE INDEX `AssignedAgent_AgentId_AgentGroupID_key`(`AgentId`, `AgentGroupID`),
    PRIMARY KEY (`AssignedAgentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AssignedAgent` ADD CONSTRAINT `AssignedAgent_AgentId_fkey` FOREIGN KEY (`AgentId`) REFERENCES `Agent`(`AgentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignedAgent` ADD CONSTRAINT `AssignedAgent_AgentGroupID_fkey` FOREIGN KEY (`AgentGroupID`) REFERENCES `AgentGroup`(`AgentGroupID`) ON DELETE RESTRICT ON UPDATE CASCADE;
