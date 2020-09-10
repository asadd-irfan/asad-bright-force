const mongoose = require('mongoose')
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      dbName: process.env.MONGO_DB_DATABASE,
      user: process.env.MONGO_DB_USER,
      pass: process.env.MONGO_DB_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    console.log('Connected to MongoDB...')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB
