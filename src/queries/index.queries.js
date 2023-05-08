
module.exports = {

    addPerson: `
        INSERT INTO person(first_name, last_name, gender, profession, location, 
            birthdate, deathdate, father_id, mother_id, spouse_id, full_name)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
        `,

    updatePerson: `
        UPDATE person SET 
          first_name = COALESCE($1, first_name), 
          last_name = COALESCE($2, last_name), 
          gender = COALESCE($3, gender),
          profession = COALESCE($4, profession),
          location = COALESCE($5, location),
          birthdate = COALESCE($6, birthdate),
          deathdate = COALESCE($7, deathdate),
          father_id = COALESCE($8, father_id),
          mother_id = COALESCE($9, mother_id),
          spouse_id = COALESCE($10, spouse_id),
          full_name = COALESCE($11, full_name)
        WHERE id = $12
        RETURNING *
      `,

    getancestors:`
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

    // get a person by last name or first name or both
    getPersonByName : `
        SELECT *
        FROM person
        WHERE full_name ILIKE $1 || '%';
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
        WHERE p.full_name !LIKE lower('%'|| $1 ||'%');;
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