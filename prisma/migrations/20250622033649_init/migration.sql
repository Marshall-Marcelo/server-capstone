-- CreateTable
CREATE TABLE `User` (
    `userId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isArchived` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_firstName_lastName_key`(`firstName`, `lastName`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `roleId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('Trainer', 'Distributor', 'Head') NOT NULL,

    UNIQUE INDEX `Roles_name_key`(`name`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRoles` (
    `userId` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DistributorTypes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `haveCommission` BOOLEAN NOT NULL,

    UNIQUE INDEX `DistributorTypes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `departmentId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `trainerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Department_name_key`(`name`),
    PRIMARY KEY (`departmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Distributor` (
    `userId` VARCHAR(191) NOT NULL,
    `distributorTypeId` INTEGER NOT NULL,
    `departmentId` INTEGER NULL,
    `contactNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Distributor_userId_key`(`userId`),
    PRIMARY KEY (`userId`, `distributorTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Show` (
    `showId` INTEGER NOT NULL AUTO_INCREMENT,
    `showCoverURL` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `commisionFee` DOUBLE NOT NULL,
    `showType` ENUM('MajorConcert', 'ShowCase', 'MajorProduction') NOT NULL,
    `departmentId` INTEGER NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isArchived` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`showId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `genreId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Genre_name_key`(`name`),
    PRIMARY KEY (`genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShowGenre` (
    `showId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    PRIMARY KEY (`showId`, `genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShowSchedule` (
    `scheduleId` INTEGER NOT NULL AUTO_INCREMENT,
    `showId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `isOpen` BOOLEAN NOT NULL DEFAULT true,
    `isArchived` BOOLEAN NOT NULL DEFAULT false,
    `isRescheduled` BOOLEAN NOT NULL DEFAULT false,
    `oldSchedule` VARCHAR(191) NULL,

    PRIMARY KEY (`scheduleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShowSeat` (
    `scheduleId` INTEGER NOT NULL,
    `seatNumber` VARCHAR(191) NOT NULL,
    `seatSection` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`scheduleId`, `seatNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `controlNumber` VARCHAR(191) NOT NULL,
    `scheduleId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `distributorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`controlNumber`, `scheduleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RemittanceHistory` (
    `controlNumber` VARCHAR(191) NOT NULL,
    `scheduleId` INTEGER NOT NULL,
    `remittedBy` VARCHAR(191) NOT NULL,
    `remittedTo` VARCHAR(191) NOT NULL,
    `totalRemittance` DOUBLE NOT NULL,
    `commission` DOUBLE NOT NULL,
    `dateRemitted` DATETIME(3) NOT NULL,

    PRIMARY KEY (`controlNumber`, `scheduleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `logId` INTEGER NOT NULL AUTO_INCREMENT,
    `logType` INTEGER NOT NULL,
    `actionBy` VARCHAR(191) NOT NULL,
    `logDateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fromUserId` VARCHAR(191) NULL,
    `toUserId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`logId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogType` (
    `typeId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LogType_name_key`(`name`),
    PRIMARY KEY (`typeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Roles`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Distributor` ADD CONSTRAINT `Distributor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Distributor` ADD CONSTRAINT `Distributor_distributorTypeId_fkey` FOREIGN KEY (`distributorTypeId`) REFERENCES `DistributorTypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Distributor` ADD CONSTRAINT `Distributor_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`departmentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Show` ADD CONSTRAINT `Show_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`departmentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Show` ADD CONSTRAINT `Show_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShowGenre` ADD CONSTRAINT `ShowGenre_showId_fkey` FOREIGN KEY (`showId`) REFERENCES `Show`(`showId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShowGenre` ADD CONSTRAINT `ShowGenre_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`genreId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShowSchedule` ADD CONSTRAINT `ShowSchedule_showId_fkey` FOREIGN KEY (`showId`) REFERENCES `Show`(`showId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShowSeat` ADD CONSTRAINT `ShowSeat_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `ShowSchedule`(`scheduleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `ShowSchedule`(`scheduleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_distributorId_fkey` FOREIGN KEY (`distributorId`) REFERENCES `Distributor`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RemittanceHistory` ADD CONSTRAINT `RemittanceHistory_controlNumber_scheduleId_fkey` FOREIGN KEY (`controlNumber`, `scheduleId`) REFERENCES `Ticket`(`controlNumber`, `scheduleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RemittanceHistory` ADD CONSTRAINT `RemittanceHistory_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `ShowSchedule`(`scheduleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RemittanceHistory` ADD CONSTRAINT `RemittanceHistory_remittedBy_fkey` FOREIGN KEY (`remittedBy`) REFERENCES `Distributor`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RemittanceHistory` ADD CONSTRAINT `RemittanceHistory_remittedTo_fkey` FOREIGN KEY (`remittedTo`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_logType_fkey` FOREIGN KEY (`logType`) REFERENCES `LogType`(`typeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_actionBy_fkey` FOREIGN KEY (`actionBy`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;
