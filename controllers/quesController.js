const asyncHandler = require("express-async-handler")
const fs = require("fs").promises
const path = require("path")

//Get all questions
const getAllQuestions = asyncHandler(async (req, res) => {
  try {
    // Construct the full path to the questions.json file
    const filePath = path.join(__dirname, "..", "data", "questions.json")

    // Read the JSON file
    const jsonData = await fs.readFile(filePath, "utf8")

    // Parse the JSON data
    const questionsData = JSON.parse(jsonData)

    // Send the questions as a response
    res.status(200).json(questionsData)
  } catch (error) {
    // Handle any errors that occur during file reading or parsing
    res.status(500).json({
      message: "Error fetching questions",
      error: error.message,
    })
  }
})

module.exports = {
  getAllQuestions,
}
