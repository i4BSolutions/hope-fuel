-- CreateTable
CREATE TABLE `FollowUpComment` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `AgentId` INTEGER NOT NULL,
    `CustomerID` INTEGER NOT NULL,
    `Comment` VARCHAR(191) NOT NULL,
    `Is_Resolved` BOOLEAN NOT NULL DEFAULT false,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FollowUpComment` ADD CONSTRAINT `followUpComment_agent_fk` FOREIGN KEY (`AgentId`) REFERENCES `Agent`(`AgentId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `FollowUpComment` ADD CONSTRAINT `FollowUpComment_CustomerID_fkey` FOREIGN KEY (`CustomerID`) REFERENCES `Customer`(`CustomerId`) ON DELETE CASCADE ON UPDATE RESTRICT;
