-- CreateTable
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_names" VARCHAR NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "profession" VARCHAR,
    "location" VARCHAR NOT NULL,
    "birthdate" DATE NOT NULL,
    "deathdate" DATE,
    "full_name" VARCHAR,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationship" (
    "id" SERIAL NOT NULL,
    "person1_id" INTEGER NOT NULL,
    "person2_id" INTEGER NOT NULL,
    "relationship_type" VARCHAR NOT NULL,

    CONSTRAINT "relationship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "relationship" ADD CONSTRAINT "relationship_person1_id_fkey" FOREIGN KEY ("person1_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "relationship" ADD CONSTRAINT "relationship_person2_id_fkey" FOREIGN KEY ("person2_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
