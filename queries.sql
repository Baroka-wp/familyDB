-- Selecting all people and their professions
SELECT name, profession FROM person;

-- Selecting people who live in a specific location
SELECT name FROM person WHERE location = 'New York';


SELECT * FROM person;

SELECT * FROM relationship;

-- Get all the children of a person:
SELECT p.*
FROM person p
JOIN relationship r ON p.id = r.person2_id
WHERE r.person1_id = {parent_id} AND r.relationship_type = 'parent-child';


-- Get all the spouses of a person:
SELECT p.*
FROM person p
JOIN relationship r ON p.id = CASE WHEN r.person1_id = {person_id} THEN r.person2_id ELSE r.person1_id END
WHERE r.relationship_type = 'spouse' AND p.id != {person_id};

-- Get all the descendants of a person:
WITH RECURSIVE descendants(id) AS (
    SELECT person2_id
    FROM relationship
    WHERE person1_id = {person_id} AND relationship_type = 'parent-child'
    UNION
    SELECT r.person2_id
    FROM relationship r
    JOIN descendants d ON r.person1_id = d.id AND r.relationship_type = 'parent-child'
)
SELECT p.*
FROM person p
JOIN descendants d ON p.id = d.id;