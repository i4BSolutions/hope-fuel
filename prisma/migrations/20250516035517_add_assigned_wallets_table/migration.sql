-- CreateTable
CREATE TABLE `AssignedWallet` (
    `AssignedWalletId` INTEGER NOT NULL AUTO_INCREMENT,
    `WalletId` INTEGER NOT NULL,
    `AgentId` INTEGER NOT NULL,

    INDEX `AgentId`(`AgentId`),
    INDEX `WalletId`(`WalletId`),
    UNIQUE INDEX `AgentId_WalletId`(`AgentId`, `WalletId`),
    PRIMARY KEY (`AssignedWalletId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AssignedWallet` ADD CONSTRAINT `assignedwallet_ibfk_2` FOREIGN KEY (`AgentId`) REFERENCES `Agent`(`AgentId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `AssignedWallet` ADD CONSTRAINT `assignedwallet_ibfk_1` FOREIGN KEY (`WalletId`) REFERENCES `Wallet`(`WalletId`) ON DELETE CASCADE ON UPDATE RESTRICT;
