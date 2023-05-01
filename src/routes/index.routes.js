const express = require('express');
const router = express.Router();

const { indexController } = require('../controller/index');


router.get('/', indexController.getAllPersons);
router.post('/', indexController.addPerson);
router.post('/relationship', indexController.addRelationship);
router.get('/ancestors/:person_id', indexController.getAncestors);
router.get('/descendants/:person_id', indexController.getDescendants);
router.get('/ancestors-and-descendants/:person_id', indexController.getAnscestorsAndDescendants);
router.get('/person', indexController.getPersonByName);



module.exports = router;