
module.exports = {
    getancestors :`
        SELECT p.first_name, p.last_names, p.gender, 
            CASE WHEN p.gender = 'M' THEN 'father' ELSE 'mother' END as relationship
        FROM person p
        JOIN relationship r ON p.id = r.person1_id
        WHERE r.person2_id = $1 AND r.relationship_type = 'parent-child';
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
    `
}