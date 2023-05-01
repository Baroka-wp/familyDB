const { pool } = require('../../db');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { person, relationship } = prisma;
const { indexQueries } = require('../queries/index');

const { indexUtils } = require('../utils/index');


module.exports = {
    // add a new person
    addPerson(req, res, next) {
        const { first_name, last_names, gender, profession, location, birthday, deathday } = req.body;

        //convert birthdate and deathdate to datetime format
        const birthdate = new Date(birthday);
        const deathdate = deathday ? new Date(deathday) : null;

        // add full_name
        const full_name = `${first_name} ${last_names}`;

        try {

            person.create({
                data: {
                    first_name,
                    last_names,
                    full_name,
                    gender,
                    profession,
                    location,
                    birthdate,
                    deathdate
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

    // get a person
    getPersonByName(req, res, next) {

        const { name } = req.query;

        person.findMany({
            where: {
             
                OR: [
                  { full_name: { contains: name, mode: 'insensitive' } }
                ]
        
            }
        }).then((persons) => {
            if(persons.length === 0) {
                return res.status(200).json({message: 'Person not found'});
            } 
            res.status(200).json({
                result: indexUtils.personPresentation(persons)
            });
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
    }

}