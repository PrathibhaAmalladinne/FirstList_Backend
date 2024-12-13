const User = require("../models/User")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")

//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean()
  if (!users?.length) {
    return res.status(400).json({ message: "NO USERS FOUND" })
  }
  res.json(users)
})

//Create new user
const createNewUser = asyncHandler(async (req, res) => {
  const { username, email, name, password } = req.body

  //confirm data
  if (!username || !email || !name || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  //check for duplicates
  const duplicateUsername = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec()
  if (duplicateUsername) {
    return res.status(400).json({ message: "Username already taken" })
  }
  const duplicateEmail = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec()
  if (duplicateEmail) {
    return res.status(400).json({ message: "Email already registered" })
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10) //salt rounds
  const userObject = { username, email, name, password: hashedPassword }

  const user = await User.create(userObject)

  if (user) {
    //created
    res.status(201).json({ message: `New user ${username} created`, user })
  } else {
    res.status(400).json({ message: "Invalid user data received" })
  }
})

//Update user
//Delete user

module.exports = {
  getAllUsers,
  createNewUser,
}
