module.exports = {

    //person presentation

    personPresentation(person) { 
        const {profession, location, birthdate } = person;
  
        return `né(e) le ${birthdate} et  ${profession} à ${location}.`;
    }
}