-- CreateTable
CREATE TABLE `CSVExportTransactionLogs` (
    `CSVExportTransactionLogsId` INTEGER NOT NULL AUTO_INCREMENT,
    `AgentId` INTEGER NULL,
    `CSVExportTransactionDateTime` TIMESTAMP(0) NULL,

    INDEX `AgentId`(`AgentId`),
    PRIMARY KEY (`CSVExportTransactionLogsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CSVExportTransactionLogs` ADD CONSTRAINT `CSVExportTransactionLogs_AgentId_fkey` FOREIGN KEY (`AgentId`) REFERENCES `Agent`(`AgentId`) ON DELETE SET NULL ON UPDATE CASCADE;
