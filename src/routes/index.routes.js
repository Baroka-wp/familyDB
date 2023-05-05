const express = require('express');
const router = express.Router();

const { indexController } = require('../controller/index');


router.get('/', indexController.getAllPersons);
router.post('/', indexController.addPerson);
router.put('/:person_id', indexController.updatePerson);
router.post('/relationship', indexController.addRelationship);
router.get('/ancestors/:person_id', indexController.getAncestors);
router.get('/descendants/:person_id', indexController.getDescendants);
router.get('/ancestors-and-descendants/:person_id', indexController.getAnscestorsAndDescendants);
router.get('/person_childrens', indexController.getPersonwithChildrens);
router.get('/person', indexController.getPersonByName);
router.get('/person_genealogy', indexController.getPersonGenealogy);



module.exports = router;