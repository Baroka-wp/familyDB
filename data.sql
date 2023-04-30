-- Inserting a new person with profession and location data
INSERT INTO person (first_name, last_names, gender, birthdate, profession, location, deathdate)
VALUES ('Irotori', 'Baroka Emmanuel', 'M', '1992-01-01', 'Software Engineer', 'Ab Calavi', NULL);

INSERT INTO person (first_name, last_names, gender, birthdate, profession, location, deathdate)
VALUES ('Irotori', 'Baroka Emmanuel', 'M', '1993-01-01', 'Software Engineer', 'Ab Calavi', NULL);


-- Insert Irotori D. Bruno, who is Baroka dad, and who is a farmer, and who lives in Taguieta, born in 21/01/1950
INSERT INTO person (first_name, last_names, gender, birthdate, profession, location, deathdate)
VALUES ('Irotori', 'D. Bruno', 'M', '1950-01-21', 'Farmer', 'Taguieta', NULL);

-- Inser relationship between Irotori Baroka Emmanuel and Irotori D. Bruno
INSERT INTO relationship (person1_id, person2_id, relationship_type)
VALUES (2, 1, 'parent-child');