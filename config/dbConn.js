const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URI, {
      connectTimeoutMS: 60000,
    })
  } catch (err) {
    console.log(err, "couldn't connect to the database")
  }
}

module.exports = connectDB
