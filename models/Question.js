const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
      },
      correctOption: {
        type: Number,
        default: -1,
      },
      points: {
        type: Number,
        default: 0,
      },
    },
  ],
})

const Question = mongoose.model("Question", questionSchema)

module.exports = Question
