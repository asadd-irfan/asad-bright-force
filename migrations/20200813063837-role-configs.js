let documents = [
  { 'type': 'roles', 'name': 'Developer', isActive: true, extraConfig: { 'name': 'developer' }, },
  { 'type': 'roles', 'name': 'Designer', isActive: true, extraConfig: { 'name': 'designer' }, },
  { 'type': 'roles', 'name': 'Product Manager', isActive: true, },
  { 'type': 'roles', 'name': 'Project Manager', isActive: true, },
  { 'type': 'roles', 'name': 'Sales', isActive: true, },
  { 'type': 'roles', 'name': 'Marketing ', isActive: true, },
  { 'type': 'roles', 'name': 'Finance', isActive: true, },
  { 'type': 'roles', 'name': 'Customer Care', isActive: true, },

];

module.exports = {
  async up(db, client) {
    await db.collection('app-configurations').deleteMany({
      type: 'roles'
    });

    await db.collection('app-configurations').insertMany(documents);

  },

  async down(db, client) {
    await db.collection('app-configurations').deleteMany({
      type: 'roles'
    });

  }
};
