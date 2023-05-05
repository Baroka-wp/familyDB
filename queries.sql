CREATE TABLE Person (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  gender CHAR(1) NOT NULL,
  profession VARCHAR(50),
  location VARCHAR(100),
  birthdate DATE,
  deathdate DATE,
  father_id INTEGER REFERENCES Person(id),
  mother_id INTEGER REFERENCES Person(id),
  spouse_id INTEGER REFERENCES Person(id)
);


-- get person children
SELECT * FROM Person WHERE father_id = 1 OR mother_id = 1;