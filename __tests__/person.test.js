const { pool } = require('../db');
const { PrismaClient } = require('@prisma/client');
const { person } = new PrismaClient();
const controller = require('../src/controller/index.controller');

jest.mock('../db');


const req = {
    query: {
        name: 'John',
    },
    params: {
        person_id: 1,
    },
    body: {
        first_name: 'John',
        last_name: 'Doe',
        gender: 'male',
        profession: 'engineer',
        location: 'New York',
        birthdate: '2001-01-01',
        deathdate: null,
        father_id: null,
        spouse_id: null,
        mother_id: null,
    },
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(() => res),
    send: jest.fn(() => res),
};

const next = jest.fn();


describe('clientController - addPerson function', () => {

    it('should call res.status with 201 and res.json with the inserted person', async () => {
        const expectedResult = { id: 1, ...req.body };
        pool.query.mockResolvedValue({ rows: [expectedResult] });

        await controller.addPerson(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

   it('should add a new person', async () => {
        const expectedResult = { id: 1, ...req.body };
        pool.query.mockResolvedValue({ rows: [expectedResult] });

        await controller.addPerson(req, res, next);

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
    })

    it('John should be in query a person by name', async () => {
        const expectedResult = { id: 1, ...req.body };
        pool.query.mockResolvedValue({ rows: [expectedResult] });

        await controller.getPersonByName(req, res, next);

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
        expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

});