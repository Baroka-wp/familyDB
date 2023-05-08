const { pool } = require('../../db');
const dayjs = require('dayjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { person } = prisma;
const { indexQueries } = require('../queries/index');

module.exports = {
    // add a new person
    async addPerson(req, res, next) {
        const { first_name, last_name, gender, profession, location, 
            birthdate, deathdate, father_id, mother_id, spouse_id } = req.body;

        const full_name = `${first_name} ${last_name}`;

        try {
            const result = await pool.query(indexQueries.addPerson, [first_name, last_name, gender, 
                profession, location,birthdate, deathdate, father_id, mother_id, spouse_id, full_name])

            res.status(201).json(result.rows[0]);

        } catch (err) {
            next(err);
        }
    },

    // update a person

    async updatePerson(req, res, next) {
        const { person_id } = req.params;
        const { first_name, last_name, gender, profession, location, 
            birthdate, deathdate, father_id, mother_id, spouse_id } = req.body;

        const full_name = first_name ? `${first_name} ${last_name}`: null;

        try {
            const result = await pool.query(indexQueries.updatePerson, [first_name, last_name, gender, 
                profession, location, birthdate, deathdate, father_id, mother_id, spouse_id, full_name, person_id]);

            res.status(200).json(result.rows[0]);
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
    async getPersonByName(req, res, next) {

        const { name } = req.query;

        const resul = await pool.query(indexQueries.getPersonByName, [name]);

        res.status(200).json(resul.rows);

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

}