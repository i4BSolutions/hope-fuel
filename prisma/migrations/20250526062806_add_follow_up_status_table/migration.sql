-- CreateTable
CREATE TABLE `FollowUpStatus` (
    `FollowUpStatusID` INTEGER NOT NULL AUTO_INCREMENT,
    `StatusName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `FollowUpStatus_StatusName_key`(`StatusName`),
    PRIMARY KEY (`FollowUpStatusID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
