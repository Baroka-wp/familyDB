/*
  Warnings:

  - Added the required column `full_name` to the `person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "person" ADD COLUMN     "full_name" VARCHAR(50) NOT NULL;
