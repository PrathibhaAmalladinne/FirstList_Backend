require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const errorHandler = require("./middleware/errorHandler")
const connectDB = require("./config/dbConn")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3500

connectDB()

//middleware
//built-in middleware
app.use(express.json())
app.use(cookieParser())
app.use("/", express.static(path.join(__dirname, "public")))

//Routes
app.use("/", require("./routes/root"))
app.use("/users", require("./routes/userRoutes"))
app.use("/auth", require("./routes/authRoutes"))

// Error handler
app.use(errorHandler)
app.all("*", (req, res) => {
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"))
  } else if (req.accepts("json")) {
    res.json({ message: "404 NOT FOUND" })
  } else {
    res.type("txt").send("404 Not Found")
  }
})

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB")
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on port ${PORT}`)
  )
})

mongoose.connection.on("error", (err) => {
  console.log(err)
})
