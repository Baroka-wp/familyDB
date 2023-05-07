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


-- 
CREATE OR REPLACE FUNCTION get_family_tree(id INTEGER, max_depth INTEGER)
RETURNS JSON AS $$
WITH RECURSIVE tree AS (
    SELECT id, full_name AS name, location, profession, birthdate, deathdate, father_id, mother_id, 0 AS depth
    FROM person
    WHERE id = $1
    UNION ALL
    SELECT p.id, p.full_name AS name, p.location, p.profession, p.birthdate, p.deathdate, p.father_id, p.mother_id, t.depth + 1 AS depth
    FROM person p
    JOIN tree t ON p.father_id = t.id OR p.mother_id = t.id
    WHERE t.depth < $2
)
SELECT json_build_object(
    'id', t.id,
    'attributes', json_build_object(
        'location', t.location,
        'profession', t.profession,
        'birthdate', t.birthdate,
        'deathdate', t.deathdate
    ),
    'name', t.name,
    'children', get_children(t.id, $2 - t.depth - 1)
) FROM tree t
WHERE t.depth = 0;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_children(id INTEGER, depth INTEGER)
RETURNS JSON AS $$
SELECT json_agg(json_build_object(
    'id', p.id,
    'attributes', json_build_object(
        'location', p.location,
        'profession', p.profession,
        'birthdate', p.birthdate,
        'deathdate', p.deathdate
    ),
    'name', p.full_name,
    'children', CASE WHEN depth > 0 THEN get_children(p.id, depth - 1) ELSE JSON '[]' END
)) FROM person p
WHERE p.father_id = $1 OR p.mother_id = $1;
$$ LANGUAGE SQL;
