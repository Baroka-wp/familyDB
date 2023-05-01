CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
		last_names VARCHAR NOT NULL,
    gender CHAR(1) NOT NULL,
		profession VARCHAR,
		location VARCHAR NOT NULL,
    birthdate DATE NOT NULL,
    deathdate DATE
    CHECK (deathdate IS NULL OR deathdate >= birthdate)
);

CREATE TABLE relationship (
    id SERIAL PRIMARY KEY,
    person1_id INTEGER NOT NULL REFERENCES person (id),
    person2_id INTEGER NOT NULL REFERENCES person (id),
    relationship_type VARCHAR NOT NULL
    CHECK (person1_id != person2_id)
);


-- add column full_name to person table
ALTER TABLE person ADD COLUMN full_name VARCHAR NOT NULL;

-- update full_name column for all persons fullname = first_name + last_names
UPDATE person SET full_name = CONCAT(first_name, ' ', last_names);