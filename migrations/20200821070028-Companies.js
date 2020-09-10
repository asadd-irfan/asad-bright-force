const faker = require('faker')
var date = new Date()
const bcrypt = require('bcryptjs')
let password = bcrypt.hashSync('User@123', 12)
let testCompanyUserEmail = "companyuser@gmail.com"
const getUniqueRandomIndexes = (totalRequired, totalRecords) => {
  let randomSelectedArray = []
  while (randomSelectedArray.length < totalRequired) {
    let selected = Math.floor(Math.random() * totalRecords)
    if (!randomSelectedArray.includes(selected)) {
      randomSelectedArray.push(selected)
    }
  }
  return randomSelectedArray
}

const getRandomRecords = (recordsArray, totalRequired) => {
  let selectedRandomRecords = []
  if (totalRequired > 1) {
    let randomArray = getUniqueRandomIndexes(totalRequired, recordsArray.length)
    randomArray.forEach((element) => {
      selectedRandomRecords.push(recordsArray[element]._id)
    })
  } else {
    let selected = Math.floor(Math.random() * recordsArray.length)
    selectedRandomRecords.push(recordsArray[selected]._id)
  }
  return selectedRandomRecords
}

const getRandomConfigId = (array) => {
  let randomIndex = Math.floor(Math.random() * array.length)
  let configId = array[randomIndex]._id
  return configId
}

module.exports = {
  async up(db, client) {
    let allCompanyFeatures = await db
      .collection('app-configurations')
      .find({ type: 'company-features' })
      .toArray()
    let allCompanyValues = await db
      .collection('app-configurations')
      .find({ type: 'company-values' })
      .toArray()
    let allCompanySizes = await db
      .collection('app-configurations')
      .find({ type: 'company-size' })
      .toArray()
    let allTimeZones = await db
      .collection('app-configurations')
      .find({ type: 'timezone' })
      .toArray()
    let allIndustries = await db
      .collection('app-configurations')
      .find({ type: 'industry-preference' })
      .toArray()
    // let allTechStack = await db
    //   .collection('app-configurations')
    //   .find({ type: 'preferred-role' })
    //   .toArray()

    for (let i = 0; i < 5; i++) {
      let companyName =
        faker.company.companyName() + ' ' + faker.company.companySuffix()
      // let companyBannerImage = faker.image.image()
      let companyLogo = faker.image.business()
      let companyLocation = faker.address.city() + ' ' + faker.address.country()
      let companyAbout = faker.lorem.paragraph()

      let companyTimezone = getRandomConfigId(allTimeZones)
      let companySize = getRandomConfigId(allCompanySizes)

      let manager = await db
        .collection('admins')
        .findOne({ email: 'admin@gmail.com' })

      let usd = await db
        .collection('app-configurations')
        .findOne({ type: 'currency', name: 'U.S Dollar $' })

      let companyValues = getRandomRecords(allCompanyValues, 3)
      let companyFeatures = getRandomRecords(allCompanyFeatures, 3)
      let companyIndustries = getRandomRecords(allIndustries, 5)
      // let companyTechnologies = getRandomRecords(allTechStack, 5)
      let allCompaniesCount = await db.collection('companies').countDocuments({})

      await db.collection('companies').insertOne({
        name: companyName,
        website: 'https://www.google.com/',
        linkedIn: 'https://www.linkedin.com/',
        logo: companyLogo,
        companyId: allCompaniesCount + 1,
        // bannerImage: companyBannerImage,
        about: companyAbout,
        location: companyLocation,
        // foundationDate: new Date(
        //   new Date().setFullYear(new Date().getFullYear() - 5)
        // ),
        // fundingRaised: {
        //   amount: Math.floor(Math.random() * 1000000) + 5000000000,
        //   currency: usd._id,
        // },
        status: 'registered',
        registrationDate: date,
        createdAt: date,
        updatedAt: date,
        accountManager: manager._id,
        timezone: companyTimezone,

        size: companySize,
        industries: companyIndustries,
        // technologiesUsed: companyTechnologies,
        companyValues: companyValues,
        companyFeatures: companyFeatures,

        isAutoGenerate: true,
      })

      let company = await db
        .collection('companies')
        .findOne({ name: companyName })

      await db.collection('company-users').insertOne({
        fullName: faker.name.findName(),
        email: i == 0 ? testCompanyUserEmail : faker.internet.email().toLowerCase(),
        phone: faker.phone.phoneNumber().toString(),
        role: 'admin',
        title: 'CEO',
        password: password,
        profileImage: faker.image.image(),
        authorizations: ['hire', 'manage'],
        company: company._id,
        billingUser: true,
        createdAt: date,
        updatedAt: date,
        isAutoGenerate: true,
      })

      await db.collection('company-users').insertOne({
        fullName: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.phoneNumber().toString(),
        role: 'moderator',
        title: 'HR Manager',
        password: password,
        profileImage: faker.image.image(),
        authorizations: ['hire'],
        company: company._id,
        billingUser: false,
        createdAt: date,
        updatedAt: date,
        isAutoGenerate: true,
      })

      await db.collection('company-users').insertOne({
        fullName: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.phoneNumber().toString(),
        role: 'moderator',
        title: 'Account Manager',
        password: password,
        profileImage: faker.image.image(),
        authorizations: ['manage'],
        company: company._id,
        billingUser: false,
        createdAt: date,
        updatedAt: date,
        isAutoGenerate: true,
      })
    }
  },

  async down(db, client) {
    await db.collection('companies').deleteMany({ isAutoGenerate: true })
  },
}
