const { clearDB } = require('../../../utils/clear-db');

module.exports = (on, config) => {
    on('task', {
        clearDatabase() {
            try {
                clearDB();
                console.log('Database cleared...');
                return true;
            } catch (error) { 
                console.log(error.message);
                return false;
            }
        },
        log(message) {
            console.log(message);
            return null;
        }
    });
    //@ TODO: seed database
};
