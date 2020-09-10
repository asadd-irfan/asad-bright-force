const bcrypt = require("bcryptjs");
const faker = require("faker");
const mongoose = require('mongoose');

let password = bcrypt.hashSync("Talent@123", 12);
let testTalentEmail = "testtalent@gmail.com"
var date = new Date();

const getUniqueRandomIndexes = (totalRequired, totalRecords) => {
  let randomSelectedArray = [];
  while (randomSelectedArray.length < totalRequired) {
    let selected = Math.floor(Math.random() * totalRecords);
    if (!randomSelectedArray.includes(selected)) {
      randomSelectedArray.push(selected);
    }
  }
  return randomSelectedArray;
};

const getRandomRecords = (recordsArray, totalRequired) => {
  let selectedRandomRecords = [];
  if (totalRequired > 1) {
    let randomArray = getUniqueRandomIndexes(
      totalRequired,
      recordsArray.length
    );
    randomArray.forEach((element) => {
      selectedRandomRecords.push(recordsArray[element]._id);
    });
  } else {
    let selected = Math.floor(Math.random() * recordsArray.length);
    selectedRandomRecords.push(recordsArray[selected]._id);
  }
  return selectedRandomRecords;
};

const getRandomConfigId = (array) => {
  let randomIndex = Math.floor(Math.random() * array.length);
  let configId = array[randomIndex]._id;
  return configId;
};

module.exports = {
  async up(db, client) {
    let talentRoleDev = await db
      .collection("app-configurations")
      .findOne({ type: "roles", name: "Developer" });
    // let allRoles = await db.collection('app-configurations').find({ type: "roles" }).toArray();
    let allPreferredRoles = await db
      .collection("app-configurations")
      .find({ type: "preferred-role" })
      .toArray();
    let allEmpType = await db
      .collection("app-configurations")
      .find({ type: "employment-type" })
      .toArray();
    let allSkills = await db
      .collection("app-configurations")
      .find({ type: "skills" })
      .toArray();
    let allCompanyFeatures = await db
      .collection("app-configurations")
      .find({ type: "company-features" })
      .toArray();
    let allRoleFeatures = await db
      .collection("app-configurations")
      .find({ type: "role-features" })
      .toArray();
    let allCompanyValues = await db
      .collection("app-configurations")
      .find({ type: "company-values" })
      .toArray();
    let allCompanySizes = await db
      .collection("app-configurations")
      .find({ type: "company-size" })
      .toArray();
    let allTimeZones = await db
      .collection("app-configurations")
      .find({ type: "timezone" })
      .toArray();
    let allIndustries = await db
      .collection("app-configurations")
      .find({ type: "industry-preference" })
      .toArray();
    let allLanguages = await db
      .collection("app-configurations")
      .find({ type: "language" })
      .toArray();
    let booleanArray = [true, false];

    for (let i = 0; i < 50; i++) {
      let talentName = faker.name.findName();
      let talentEmail = i == 0 ? testTalentEmail : faker.internet.email().toLowerCase();
      let talentProfileImg = faker.image.image();
      let talentCountry = faker.address.country();
      let talentCity = faker.address.city();
      let talentPhone = faker.phone.phoneNumber().toString();

      let randomManagementExp = Math.floor(Math.random() * 2);
      let managementExp;
      if (randomManagementExp == 0) {
        managementExp = {
          status: booleanArray[randomManagementExp],
          yearsOfExperience: (Math.floor(Math.random() * 15) + 1).toString(),
        };
      } else {
        managementExp = {
          status: booleanArray[randomManagementExp],
        };
      }

      let talentTimezone = getRandomConfigId(allTimeZones);
      let talentMainRole = getRandomConfigId(allPreferredRoles);
      let talentSecondaryRole = getRandomConfigId(allPreferredRoles);
      if (talentMainRole == talentSecondaryRole) {
        talentSecondaryRole = getRandomConfigId(allPreferredRoles);
      }
      let talentMainRoleSkills = getRandomRecords(allSkills, 4);
      let talentSecondaryRoleSkills = getRandomRecords(allSkills, 3);

      let talentEmpType = getRandomRecords(allEmpType, 1);
      let talentCompanySize = getRandomRecords(allCompanySizes, 1);
      let talentIndustryPreferences = getRandomRecords(allIndustries, 5);

      let talentWorkHours;
      let partTime = await db
        .collection("app-configurations")
        .findOne({ type: "employment-type", _id: talentEmpType[0] });
      if (partTime.name == "Part time") {
        let startHour = Math.floor(Math.random() * 12) + 6;
        talentWorkHours = {
          startingHour: startHour,
          endingHour: startHour + 4,
        };
      } else {
        let startHour = Math.floor(Math.random() * 8) + 6;
        talentWorkHours = {
          startingHour: startHour,
          endingHour: startHour + 8,
        };
      }
      let talentCompanyValues = [],
        talentRoleFeatures = [],
        talentLanguages = [],
        talentCompanyFeatures = [];

      let companyValues = getRandomRecords(allCompanyValues, 3);
      let roleFeatures = getRandomRecords(allRoleFeatures, 3);
      let companyFeatures = getRandomRecords(allCompanyFeatures, 3);
      let languages = getRandomRecords(allLanguages, 3);

      for (let i = 0; i < 3; i++) {
        let roleFeatureObj = {
          feature: roleFeatures[i],
          priorityOrder: i + 1,
        };
        talentRoleFeatures.push(roleFeatureObj);

        let companyValueObj = {
          value: companyValues[i],
          priorityOrder: i + 1,
        };
        talentCompanyValues.push(companyValueObj);

        let companyFeatureObj = {
          feature: companyFeatures[i],
          priorityOrder: i + 1,
        };
        talentCompanyFeatures.push(companyFeatureObj);

        let languageObj = {
          name: languages[i],
          priorityOrder: i + 1,
        };
        talentLanguages.push(languageObj);
      }
      let talentWorkExp = [],
        talentEducation = [];
      var workExpId = mongoose.Types.ObjectId();
      var talentEducationId = mongoose.Types.ObjectId();

      let workExp = {
        _id: workExpId,
        companyName:
          faker.company.companyName() + " " + faker.company.companySuffix(),
        title: faker.name.jobTitle(),
        startDate: new Date(
          new Date().setFullYear(new Date().getFullYear() - 2)
        ),
        endDate: date,
        description: faker.lorem.paragraph(),
      };
      let edu = {
        _id: talentEducationId,
        instituteName: "Oxford University",
        graduationYear: "2010",
        degreeTitle: "Software Engineer",
      };

      talentWorkExp.push(workExp);
      talentEducation.push(edu);
      // let talentAchievements = faker.lorem.paragraph();
      // let talentAboutMe = faker.lorem.paragraph();
      let talentSummary = faker.lorem.paragraph();
      let allTalentsCount = await db.collection('talents').countDocuments({})

      await db.collection("talents").insertOne({
        talentId: allTalentsCount + 1,
        name: talentName,
        email: talentEmail,
        password: password,
        role: talentRoleDev._id,
        profileImage: talentProfileImg,
        location: {
          country: talentCity,
          city: talentCountry,
        },
        phone: talentPhone,
        github: "https://github.com/",
        linkedIn: "https://www.linkedin.com/",
        stackOverflow: "https://stackoverflow.com/",
        personalWebsite: "https://www.google.com/",
        preferredRoles: {
          // description: faker.lorem.paragraph(),
          mainRole: {
            name: talentMainRole,
            yearsOfExperience: (Math.floor(Math.random() * 15) + 1).toString(),
            skills: talentMainRoleSkills,
          },
          secondaryRole: {
            name: talentSecondaryRole,
            yearsOfExperience: (Math.floor(Math.random() * 15) + 1).toString(),
            skills: talentSecondaryRoleSkills,
          },
          managementExperience: managementExp,
        },
        salary: {
          minSalary: Math.floor(Math.random() * 100000) + 50000,
        },
        workExperience: talentWorkExp,
        education: talentEducation,
        employmentType: talentEmpType,
        workingHours: talentWorkHours,
        timezone: talentTimezone,
        companyPreferences: {
          companySize: talentCompanySize,
          industryPreference: talentIndustryPreferences,
        },
        workplaceFeatures: {
          roleFeatures: talentRoleFeatures,
          companyValues: talentCompanyValues,
          companyFeatures: talentCompanyFeatures,
        },
        profileApproved: { status: true },
        summary: talentSummary,
        languages: talentLanguages,
        dontHaveResume: true,
        selfTaught: false,
        currentStatus: "talent-accepted",
        profileStatus: "active",
        availabilityStatus: "live",
        createdAt: date,
        updatedAt: date,
        isDeveloper: true,
        isAutoGenerate: true,
      });

      // await db.collection("talents").updateOne({ email: talentEmail }, {
      //   $push: {
      //     workExperience: workExp,
      //     education: talentEducation
      //   }
      // })
    }
  },

  async down(db, client) {
    await db.collection("talents").deleteMany({ isAutoGenerate: true });
  },
};
