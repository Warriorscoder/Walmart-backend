/*
  Warnings:

  - Added the required column `userId` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "userId" TEXT NOT NULL;
