
module.exports = {
    getancestors :`
            SELECT
            p1.id,
            p1.full_name AS person_name,
            p1.gender AS person_gender,
            p1.profession AS person_profession,
            p1.location AS person_location,
            p1.birthdate AS person_birthdate,
            p1.deathdate AS person_deathdate,
            json_build_object(
            'id', p2.id,
            'name', p2.full_name,
            'gender', p2.gender,
            'profession', p2.profession,
            'location', p2.location,
            'birthdate', p2.birthdate,
            'deathdate', p2.deathdate
            ) AS father,
            json_build_object(
            'id', p3.id,
            'name', p3.full_name,
            'gender', p3.gender,
            'profession', p3.profession,
            'location', p3.location,
            'birthdate', p3.birthdate,
            'deathdate', p3.deathdate
            ) AS mother
        FROM
            person p1
        LEFT JOIN person p2 ON p1.father_id = p2.id
        LEFT JOIN person p3 ON p1.mother_id = p3.id
        WHERE
            p1.id = $1;
    `,

    getdescendants :`
        WITH RECURSIVE descendants(id) AS (
            SELECT person2_id
            FROM relationship
            WHERE person1_id = $1 AND relationship_type = 'parent-child'
            UNION
            SELECT r.person2_id
            FROM relationship r
            JOIN descendants d ON r.person1_id = d.id AND r.relationship_type = 'parent-child'
            )
            SELECT p.first_name, p.last_names, p.gender, 
            CASE WHEN p.gender = 'F' THEN 'daughter' ELSE 'son' END as relationship 
            FROM person p
            JOIN descendants d ON p.id = d.id;
        `,

    getAnscestorsAndDescendants : `
        WITH RECURSIVE descendants(id) AS (
            SELECT person2_id
            FROM relationship
            WHERE person1_id = $1 AND relationship_type = 'parent-child'
            UNION
            SELECT r.person2_id
            FROM relationship r
            JOIN descendants d ON r.person1_id = d.id AND r.relationship_type = 'parent-child'
        ),
        ancestors(id) AS (
            SELECT person1_id
            FROM relationship
            WHERE person2_id = $1 AND relationship_type = 'parent-child'
            UNION
            SELECT r.person1_id
            FROM relationship r
            JOIN ancestors a ON r.person2_id = a.id AND r.relationship_type = 'parent-child'
        )
        SELECT p.first_name, p.last_names, p.gender, 'descendant' as type, 
            CASE WHEN p.gender = 'F' THEN 'daughter' ELSE 'son' END as relationship 
        FROM person p
        JOIN descendants d ON p.id = d.id
        UNION
        SELECT p.first_name, p.last_names, p.gender, 'ancestor' as type, 
            CASE WHEN p.gender = 'M' THEN 'father' ELSE 'mother' END as relationship
        FROM person p
        JOIN ancestors a ON p.id = a.id;
    `,

    // get a person by last name or first name or both
    getPersonByName : `
        SELECT * FROM person
        WHERE first_name LIKE $1 OR last_names LIKE $1;
    `,

    getPersonChildreByDeth : `
    WITH RECURSIVE family_tree AS (
        SELECT p.*, r.relationship_type, 0 AS depth
        FROM person AS p
        JOIN relationship AS r ON p.id = r.person1_id
        WHERE p.id = $1
        UNION ALL
        SELECT p.*, r.relationship_type, ft.depth + 1 AS depth
        FROM person AS p
        JOIN relationship AS r ON p.id = r.person1_id
        JOIN family_tree AS ft ON ft.id = r.person2_id
      )
      SELECT * FROM family_tree ORDER BY depth;
    `,

    getPersonWithParents : `
        SELECT p.*,
            (
                SELECT json_agg(parent)
                FROM person parent
                WHERE (p.father_id = parent.id OR p.mother_id = parent.id)
            ) AS parents
        FROM person p
        WHERE p.full_name ILIKE $1 || '%';
    `,

    getPersonWithChildren : `
            SELECT get_family_tree($1, 5);
        `,

   

    getPersonGenealogy: `
        WITH RECURSIVE ancestors AS (
            SELECT id, full_name, birthdate, father_id, gender
            FROM person
            WHERE id = $1
            
            UNION ALL
            
            SELECT p.id, p.full_name, p.birthdate, p.father_id, p.gender
            FROM person p
            JOIN ancestors a ON p.id = a.father_id
        )
        SELECT id, full_name, birthdate, gender
        FROM ancestors
        WHERE father_id IS NULL AND ancestors.gender = 'M'
        ORDER BY birthdate DESC
        LIMIT 1;
    `
        

         
}