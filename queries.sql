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

-- Get all the ancestors of a person:
WITH RECURSIVE ancestors(id) AS (
    SELECT person1_id
    FROM relationship
    WHERE person2_id = {person_id} AND relationship_type = 'parent-child'
    UNION
    SELECT r.person1_id
    FROM relationship r
    JOIN ancestors a ON r.person2_id = a.id AND r.relationship_type = 'parent-child'
)
SELECT p.*
FROM person p
JOIN ancestors a ON p.id = a.id;


-- get father and mother of a person, specifief who is father and who is mother
SELECT p.*
FROM person p
JOIN relationship r ON p.id = r.person1_id
WHERE r.person2_id = {person_id} AND r.relationship_type = 'parent-child';

-- select all ascendants and decendants of a person and if descendant gender M = father else mother and if ancestor gender M = son else daughter


-- select all ascendants and decendants of a person
WITH RECURSIVE descendants(id) AS (
    SELECT person2_id
    FROM relationship
    WHERE person1_id = 2 AND relationship_type = 'parent-child'
    UNION
    SELECT r.person2_id
    FROM relationship r
    JOIN descendants d ON r.person1_id = d.id AND r.relationship_type = 'parent-child'
),
ancestors(id) AS (
    SELECT person1_id
    FROM relationship
    WHERE person2_id = 2 AND relationship_type = 'parent-child'
    UNION
    SELECT r.person1_id
    FROM relationship r
    JOIN ancestors a ON r.person2_id = a.id AND r.relationship_type = 'parent-child'
)
SELECT p.first_name, p.last_names, p.gender, 'descendant' as type, 'son' as relationship if p.gender = 'F' else 'daughter' as relationship
FROM person p
JOIN descendants d ON p.id = d.id
UNION
SELECT p.first_name, p.last_names, p.gender, 'ancestor' as type, 'father' as relationship if p.gender = 'M' else 'mother' as relationship
FROM person p
JOIN ancestors a ON p.id = a.id;






