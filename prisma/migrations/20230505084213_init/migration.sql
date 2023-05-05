/*
  Warnings:

  - You are about to drop the column `full_name` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `last_names` on the `person` table. All the data in the column will be lost.
  - You are about to alter the column `first_name` on the `person` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
  - You are about to alter the column `profession` on the `person` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
  - You are about to alter the column `location` on the `person` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to drop the `relationship` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `last_name` to the `person` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "relationship" DROP CONSTRAINT "relationship_person1_id_fkey";

-- DropForeignKey
ALTER TABLE "relationship" DROP CONSTRAINT "relationship_person2_id_fkey";

-- AlterTable
ALTER TABLE "person" DROP COLUMN "full_name",
DROP COLUMN "last_names",
ADD COLUMN     "father_id" INTEGER,
ADD COLUMN     "last_name" VARCHAR(50) NOT NULL,
ADD COLUMN     "mother_id" INTEGER,
ADD COLUMN     "spouse_id" INTEGER,
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "profession" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "location" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "birthdate" DROP NOT NULL;

-- DropTable
DROP TABLE "relationship";

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_father_id_fkey" FOREIGN KEY ("father_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_mother_id_fkey" FOREIGN KEY ("mother_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_spouse_id_fkey" FOREIGN KEY ("spouse_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
