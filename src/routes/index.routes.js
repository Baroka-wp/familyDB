const express = require('express');
const router = express.Router();

const { indexController } = require('../controller/index');


router.get('/', indexController.getAllPersons);
router.post('/', indexController.addPerson);
router.put('/:person_id', indexController.updatePerson);
router.get('/ancestors/:person_id', indexController.getAncestors);
router.get('/person_childrens', indexController.getPersonwithChildrens);
router.get('/person', indexController.getPersonByName);
router.get('/person_genealogy', indexController.getPersonGenealogy);




module.exports = router;