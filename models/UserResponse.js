const mongoose = require("mongoose")

const UserResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    responses: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Question",
        },
        selectedOptions: [
          {
            questionIndex: {
              type: Number,
              required: true,
            },
            selectedOptionIndex: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const UserResponse = mongoose.model("UserResponse", UserResponseSchema)
module.exports = UserResponse
