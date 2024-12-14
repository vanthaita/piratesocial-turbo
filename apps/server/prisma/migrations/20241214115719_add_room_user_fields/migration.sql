/*
  Warnings:

  - Added the required column `imgSrc` to the `RoomUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastMessage` to the `RoomUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `RoomUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `RoomUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `RoomUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoomUser" ADD COLUMN     "imgSrc" INTEGER NOT NULL,
ADD COLUMN     "lastMessage" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "unread" INTEGER NOT NULL DEFAULT 0;
