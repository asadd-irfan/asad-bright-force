
var seeder = require('mongoose-seed');
const dotenv = require('dotenv');
dotenv.config();

const data = require('./server/seeders/app-configs-seeders')
if (process.env.MONGO_DB_SEED_URI) {
  console.log('MONGO_DB_SEED_URI : ', process.env.MONGO_DB_SEED_URI)

  seeder.connect(process.env.MONGO_DB_SEED_URI,{dbName: process.env.MONGO_DB_DATABASE,
  user: process.env.MONGO_DB_USER,
  pass: process.env.MONGO_DB_PASSWORD,}, function () {
    console.log('Connected to db : ' + process.env.MONGO_DB_SEED_URI + ' for seeding data.')
    // Load Mongoose models
    seeder.loadModels([
      './server/admin/models/app-config-model.js'
    ]);
    // Clear specified collections
    if (process.argv && process.argv.length > 2 && process.argv[2] == 'clear') {
      console.log('Clearing app-config model and importing new Data.')

      seeder.clearModels(['app-configurations'], function () {
        seeder.populateModels(data, function () {
          seeder.disconnect();
        });
      });
    } else {
      console.log('importing data')
      seeder.populateModels(data, function () {
        seeder.disconnect();
      });
    }


  });
} else {
  console.log('no database exist for seeding')
}
