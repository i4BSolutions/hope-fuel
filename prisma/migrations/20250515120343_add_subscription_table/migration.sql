-- CreateTable
CREATE TABLE `Subcription` (
    `SubscriptionID` INTEGER NOT NULL AUTO_INCREMENT,
    `CustomerID` INTEGER NOT NULL,
    `StartDate` DATE NOT NULL,
    `EndDate` DATE NOT NULL,
    `CreateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `CustomerID`(`CustomerID`),
    PRIMARY KEY (`SubscriptionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subcription` ADD CONSTRAINT `subscription_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `Customer`(`CustomerId`) ON DELETE CASCADE ON UPDATE RESTRICT;
