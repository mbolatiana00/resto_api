/*
  Warnings:

  - You are about to drop the column `price` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `otptoken` table. All the data in the column will be lost.
  - You are about to alter the column `method` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - A unique constraint covering the columns `[licenseNo]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plateNumber]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `OtpToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `OtpToken_email_fkey` ON `otptoken`;

-- DropIndex
DROP INDEX `tracking_deliveryId_fkey` ON `tracking`;

-- AlterTable
ALTER TABLE `delivery` ADD COLUMN `status` ENUM('ASSIGNED', 'EN_ROUTE', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED') NOT NULL DEFAULT 'ASSIGNED';

-- AlterTable
ALTER TABLE `order` DROP COLUMN `price`,
    ADD COLUMN `deliveryLat` DOUBLE NULL,
    ADD COLUMN `deliveryLng` DOUBLE NULL,
    ADD COLUMN `note` VARCHAR(191) NULL,
    ADD COLUMN `pickupLat` DOUBLE NULL,
    ADD COLUMN `pickupLng` DOUBLE NULL,
    ADD COLUMN `totalPrice` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `otptoken` DROP COLUMN `email`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `method` ENUM('CASH', 'CARD', 'MOBILE_MONEY', 'WALLET') NOT NULL,
    MODIFY `status` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `tracking` ADD COLUMN `accuracy` DOUBLE NULL;

-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `year` INTEGER NULL;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DOUBLE NOT NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Driver_licenseNo_key` ON `Driver`(`licenseNo`);

-- CreateIndex
CREATE INDEX `Order_status_idx` ON `Order`(`status`);

-- CreateIndex
CREATE INDEX `OtpToken_userId_idx` ON `OtpToken`(`userId`);

-- CreateIndex
CREATE INDEX `Tracking_deliveryId_createdAt_idx` ON `Tracking`(`deliveryId`, `createdAt`);

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_plateNumber_key` ON `Vehicle`(`plateNumber`);

-- AddForeignKey
ALTER TABLE `OtpToken` ADD CONSTRAINT `OtpToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delivery` ADD CONSTRAINT `Delivery_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delivery` ADD CONSTRAINT `Delivery_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tracking` ADD CONSTRAINT `Tracking_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `Delivery`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `delivery` RENAME INDEX `delivery_driverId_fkey` TO `Delivery_driverId_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `order_userId_fkey` TO `Order_userId_idx`;
