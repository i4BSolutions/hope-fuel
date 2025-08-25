-- AlterTable
ALTER TABLE `CustomerAuditLogs` MODIFY `FieldChanged` ENUM('Name', 'Email', 'UserCountry', 'CardID') NOT NULL;