const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

//Login POST/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const foundUser = await User.findOne({ email }).exec()

  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized in authcontroller" })
  }

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match)
    return res.status(401).json({ message: "Unauthorized in authcontroller" })

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10s" }
  )

  const refreshToken = jwt.sign(
    { email: foundUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  )

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  })

  // Send accessToken containing email
  res.json({ accessToken })
})

//Refresh GET/auth/refresh
const refresh = (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" })

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: err })
      const foundUser = await User.findOne({
        email: decoded.email,
      }).exec()

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" })

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      )

      res.json({ accessToken })
    })
  )
}

//Logout POST /auth/logout
const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
  res.json({ message: "Cookie cleared" })
}

module.exports = {
  login,
  refresh,
  logout,
}
