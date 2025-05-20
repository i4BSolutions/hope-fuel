-- AlterTable
ALTER TABLE `AgentGroup` ADD COLUMN `AgentId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `AgentId` ON `AgentGroup`(`AgentId`);
