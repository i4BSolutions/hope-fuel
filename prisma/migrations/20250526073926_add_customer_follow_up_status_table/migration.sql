-- CreateTable
CREATE TABLE `CustomerFollowUpStatus` (
    `CustomerFollowUpStatusID` INTEGER NOT NULL AUTO_INCREMENT,
    `CustomerID` INTEGER NOT NULL,
    `FollowUpStatusID` INTEGER NOT NULL,
    `FollowUpDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `CustomerID`(`CustomerID`),
    INDEX `FollowUpStatusID`(`FollowUpStatusID`),
    PRIMARY KEY (`CustomerFollowUpStatusID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerFollowUpStatus` ADD CONSTRAINT `customerfollowupstatus_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `Customer`(`CustomerId`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `CustomerFollowUpStatus` ADD CONSTRAINT `customerfollowupstatus_ibfk_2` FOREIGN KEY (`FollowUpStatusID`) REFERENCES `FollowUpStatus`(`FollowUpStatusID`) ON DELETE CASCADE ON UPDATE RESTRICT;
