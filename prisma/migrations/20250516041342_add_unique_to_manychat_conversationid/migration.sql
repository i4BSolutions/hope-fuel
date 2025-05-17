/*
  Warnings:

  - You are about to alter the column `ConversationId` on the `ManyChat` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[ConversationId]` on the table `ManyChat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `ManyChat` MODIFY `ConversationId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ManyChat_ConversationId_key` ON `ManyChat`(`ConversationId`);
