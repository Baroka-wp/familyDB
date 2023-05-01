module.exports = {

    //person presentation

    personPresentation(persons) { 


        const PRESENTATION = []
        persons.forEach((person) => {
            const {first_name, last_names, gender, profession, location, birthdate, deathdate } = person;
    
            // convert birthdate to 15 avril 1990 format
            const birthD = new Date(birthdate);
            const birthday = birthdate.toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'});
    
            const presentation = `${first_name} ${last_names} êtes né(e) le ${birthday} et  ${profession} à ${location}.`;
    
            PRESENTATION.push(presentation);
        });

        return PRESENTATION;
    },

}