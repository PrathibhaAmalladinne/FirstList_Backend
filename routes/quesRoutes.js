const express = require("express")
const router = express.Router()
const quesController = require("../controllers/quesController")
const verifyJWT = require("../middleware/verfyJWT")

router.use(verifyJWT)
router.route("/").get(quesController.getAllQuestions)
//   .post(quesController.createNewQuestion)
//patch
//delete

module.exports = router
