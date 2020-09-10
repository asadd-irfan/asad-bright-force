let documents = [
  { 'type': 'configs', 'name': 'salary-range', 'weight': 0.2 },
  { 'type': 'configs', 'name': 'secondary-role-weight', 'weight': 2 },

  { "type": "configs", "name": "somewhat-flexible", "weight": 2 },
  { "type": "configs", "name": "flexible", "weight": 4 },
  { "type": "configs", "name": "not-flexible", "weight": 6 },
  { "type": "configs", "name": "very-flexible", "weight": 0 },

  { "type": "configs", "name": "job-start-time", "weight": 9 },
  { "type": "configs", "name": "job-end-time", "weight": 18 },

];

module.exports = {
  async up(db, client) {

    await db.collection('app-configurations').deleteMany(
      { 'type': 'configs' }
    );

    await db.collection('app-configurations').insertMany(documents);
  },

  async down(db, client) {
    await db.collection('app-configurations').deleteMany(
      { 'type': 'configs' }
    );
  }
};
