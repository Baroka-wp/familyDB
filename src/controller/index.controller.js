const { pool } = require('../../db');
const dayjs = require('dayjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { person, relationship } = prisma;
const { indexQueries } = require('../queries/index');

const { indexUtils } = require('../utils/index');


module.exports = {
    // add a new person
    addPerson(req, res, next) {
        const { first_name, last_name, gender, profession, location, 
            birthday, deathday, father_id,mother_id, spouse_id  } = req.body;

        //convert birthdate and deathdate to datetime format
        const birthdate = new Date(birthday);
        const deathdate = deathday ? new Date(deathday) : null;

        // add full_name
        const full_name = `${first_name} ${last_name}`;

        try {

            person.create({
                data: {
                    first_name,
                    last_name,
                    full_name,
                    gender,
                    profession,
                    location,
                    birthdate,
                    deathdate,
                    father_id,
                    mother_id,
                    spouse_id
                }
            }).then((person) => {
                res.status(201).send(person);
            }).catch((err) => {
                console.log(err)
                res.status(500).send(err);
            });
        } catch (err) {
            next(err);
        }
    },

    // update a person

    updatePerson(req, res, next) {
        const { person_id } = req.params;

        const myperson = person.findUnique({
            where: {
                id: parseInt(person_id)
            }
        });

        const { first_name, last_name, gender, full_name, profession, location, 
            birthday, deathday, father_id,mother_id, spouse_id  } = req.body;

            console.log(birthday);

        const birthdate = deathday !== undefined ?  new Date(birthday) : myperson.birthdate;
        const deathdate = deathday !== undefined ? new Date(deathday) : myperson.deathdate;

        console.log(birthdate);

        try {

            person.update({
                where: {
                    id: parseInt(person_id)
                },
                data: {
                    first_name,
                    last_name,
                    full_name,
                    gender,
                    profession,
                    location,
                    birthdate,
                    deathdate,
                    father_id,
                    mother_id,
                    spouse_id
                }
            }).then((person) => {
                res.status(201).send(person);
            }).catch((err) => {
                console.log(err)
                res.status(200).send(err);
            });

        } catch (err) {
            next(err);
        }


    },


    async getPersonwithChildrens (req, res, next) {

        const { person_id } = req.query;

        try {
            const result = await pool.query(indexQueries.getPersonWithChildren, [person_id]);
            
            const persons = result.rows;

            res.status(200).json(persons);
        } catch (err) {
            next(err);
        }

    },

    async getPersonGenealogy (req, res, next) {
        const { person_id } = req.query;

        try {
            const result = await pool.query(indexQueries.getPersonGenealogy, [person_id]);
            const person_ansestor = result.rows[0];

            if(!person_ansestor) {
                const result =  await pool.query(indexQueries.getPersonWithChildren, [person_id]);
                return res.status(200).json(result.rows[0].get_family_tree);
            }

            const genealogy = await pool.query(indexQueries.getPersonWithChildren, [person_ansestor.id]);
                        
            res.status(200).json(genealogy.rows[0].get_family_tree);
        } catch (err) {
            next(err);
        }


    },

    // get a person
    getPersonByName(req, res, next) {

        const { name } = req.query;

        person.findMany({
            where: {
             
                OR: [
                  { full_name: { contains: name, mode: 'insensitive' } }
                ]
            },
            
        }).then((persons) => {
            if(persons.length === 0) {
                return res.status(200).json([]);
            } 

            persons.map((person) => {
                person.birthdate = person.birthdate ? person.birthdate.toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) : null;
                person.deathdate = person.deathdate ? person.deathdate.toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) : null;
                person.resume = indexUtils.personPresentation(person);
                person.value = person.id;
                person.label = person.full_name;
            });

            res.status(200).json(persons);

        }).catch((err) => {
            console.log(err)
            res.status(500).json(err);
        });

    },

    // get all persons
    getAllPersons(req, res, next) {

        try {
            person.findMany().then((persons) => {
                res.status(200).send(persons);
            }).catch((err) => {
                res.status(500).send(err);
            });
        } catch(err) {
            next(err);
        }
        
    },

    // add relationship
    addRelationship(req, res, next) {
        const { person1_id, person2_id, relationship_type } = req.body;

        try{

            relationship.create({
                data: {
                    person1_id,
                    person2_id,
                    relationship_type
                }
            }).then((relationship) => {
                res.status(201).send(relationship);
            }).catch((err) => {
                res.status(500).send(err);
            });

        } catch (err) {
            next(err);
        }
        
    },

    // get a person descendants
    async getAncestors(req, res, next) {

        const { person_id } = req.params;
        try{
            const ancestors = await pool.query(indexQueries.getancestors, [person_id]);

            res.status(200).send(ancestors.rows);

        } catch (err) {
            next(err);
        }

    },

    // get a person descendants
    async getDescendants(req, res, next) {
            
            const { person_id } = req.params;
    
            try{

                const descendants = await pool.query(indexQueries.getdescendants, [person_id]);
        
                res.status(200).send(descendants.rows);
            } catch (err) {
                next(err);
            }
    },

    // get a person descendants and ancestors
    async getAnscestorsAndDescendants(req, res, next) {
        const { person_id } = req.params;

        try{
            
              const ancestorsAndDescendants = await pool.query(indexQueries.getAnscestorsAndDescendants, [person_id]);
  
              res.status(200).send(ancestorsAndDescendants.rows);
        } catch (err) {
            next(err);
        }
    },

}