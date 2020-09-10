
const faker = require('faker');

var date = new Date()

const getUniqueRandomIndexes = (totalRequired, totalRecords) => {
  let randomSelectedArray = []
  while (randomSelectedArray.length < totalRequired) {
    let selected = Math.floor(Math.random() * totalRecords);
    if (!randomSelectedArray.includes(selected)) {
      randomSelectedArray.push(selected)
    }
  }
  return randomSelectedArray;
}

const getRandomRecords = (recordsArray, totalRequired) => {
  let selectedRandomRecords = [];
  if (totalRequired > 1) {
    let randomArray = getUniqueRandomIndexes(totalRequired, recordsArray.length);
    randomArray.forEach(element => {
      selectedRandomRecords.push(recordsArray[element]._id)
    });
  } else {
    let selected = Math.floor(Math.random() * recordsArray.length);
    selectedRandomRecords.push(recordsArray[selected]._id);

  }
  return selectedRandomRecords;
}

const getRandomConfigId = (array) => {
  let randomIndex = Math.floor(Math.random() * array.length);
  let configId = array[randomIndex]._id
  return configId;
}

module.exports = {
  async up(db, client) {
    let roleDev = await db.collection('app-configurations').findOne({ type: "roles", name: "Developer" })
    let allPreferredRoles = await db.collection('app-configurations').find({ type: "preferred-role" }).toArray();
    let allEmpType = await db.collection('app-configurations').find({ type: "employment-type" }).toArray();
    let allSkills = await db.collection('app-configurations').find({ type: "skills" }).toArray();
    let allRoleFeatures = await db.collection('app-configurations').find({ type: "role-features" }).toArray();
    let allTimeZones = await db.collection('app-configurations').find({ type: "timezone" }).toArray();
    let allPositionOffers = await db.collection('app-configurations').find({ type: "position-offer" }).toArray();
    let booleanArray = [true, false];
    let workFlexibilityArray = ['very-flexible', 'somewhat-flexible', 'flexible', 'not-flexible'];
    let usd = await db.collection('app-configurations').findOne({ 'type': 'currency', 'name': 'U.S Dollar $' })
    let manager = await db.collection('admins').findOne({ email: 'admin@gmail.com' });
    let allCompanies = await db.collection('companies').find().toArray();


    // console.log('companyId',companyId)
    for (let i = 0; i < 5; i++) {
      let companyId = getRandomConfigId(allCompanies);
      let hiringMembers = await db.collection('company-users').find({ company: companyId }).toArray();

      let positionHiringTeam = [];
      let adminUserId;
      hiringMembers.map(user => {
        if (user.authorizations.includes("hire")) {
          positionHiringTeam.push(user._id)
        }
        if (user.role == "admin") {
          adminUserId = user._id;
        }
      })

      let randomManagementExp = Math.floor(Math.random() * 2)
      let managementExp;
      if (randomManagementExp == 0) {
        managementExp = {
          status: booleanArray[randomManagementExp],
          yearsOfExperience: (Math.floor(Math.random() * 5) + 1).toString(),

        }
      } else {
        managementExp = {
          status: booleanArray[randomManagementExp],
        }
      }

      let positionSkills = getRandomRecords(allSkills, 3)
      let randomIndex = Math.floor(Math.random() * 4)
      let positionWorkFlexibility = workFlexibilityArray[randomIndex]

      let positionEmpType = getRandomConfigId(allEmpType);
      let positionTimezone = getRandomConfigId(allTimeZones);
      let positionRole = getRandomConfigId(allPreferredRoles);

      let positionSigningBonus = getRandomConfigId(allPositionOffers);
      let positionEquity = getRandomConfigId(allPositionOffers);

      let positionFeatures = [];
      let roleFeatures = getRandomRecords(allRoleFeatures, 3);

      for (let i = 0; i < 3; i++) {
        let roleFeatureObj = {
          feature: roleFeatures[i],
          priorityOrder: i + 1
        }
        positionFeatures.push(roleFeatureObj)
      }
      let allPositionsCount = await db.collection('positions').countDocuments({})

      await db.collection('positions').insertOne({
        // let obj = {
        name: roleDev._id,
        positionId: allPositionsCount + 1,
        positionCreatedBy: adminUserId,
        title: 'Software Engineer',
        mainResponsibilities: faker.lorem.paragraph(),
        managementExperience: managementExp,
        role: {
          name: positionRole,
          yearsOfExperience: (Math.floor(Math.random() * 5) + 1).toString(),
        },
        skills: positionSkills,
        positionFeatures: positionFeatures,
        employmentType: positionEmpType,
        timezone: positionTimezone,
        status: 'Open',
        lastGroupStatus: 'un-processed',
        sentToAccountManager: true,
        workingHours: {
          startingHour: 9,
          endingHour: 18
        },
        workingTimeFlexibility: positionWorkFlexibility,
        groupConfigs: {
          candidatesPerGroup: 10,
          matchingScore: 70,
          totalGroups: 3
        },
        assignedAccountManager: manager._id,
        nextDispatchedDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        positionOffer: {
          salary: Math.floor(Math.random() * 100000) + 50000,
          currency: usd._id,
          equity: positionEquity,
          performanceBonus: Math.floor(Math.random() * 10) + 1,
          signingBonus: positionSigningBonus
        },
        companyId: companyId,
        hiringTeam: positionHiringTeam,
        createdAt: date,
        updatedAt: date,
        isAutoGenerate: true,
        isDeleted: false,
      });
      // };
      // console.log('11111111111111111111111111111', obj)
    }

  },

  async down(db, client) {
    await db.collection('positions').deleteMany(
      { 'isAutoGenerate': true }
    );
  }
};


