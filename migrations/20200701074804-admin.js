
const bcrypt = require('bcryptjs');
let password = bcrypt.hashSync("123456", 12);
var date = new Date()
module.exports = {
  async up(db, client) {
     await db.collection('admins').insertOne({
       name: "Brightforce Admin",
       email: "admin@gmail.com",
       phone: "+92 90078601",
       role: "admin",
       password: password,
       createdAt: date,
       updatedAt: date
      });
  },

  async down(db, client) {
    await db.collection('admins').deleteOne({email: 'admin@gmail.com'});
  }
};
