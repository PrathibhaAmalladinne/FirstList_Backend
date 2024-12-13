const express = require("express")
const router = express.Router()
const usersController = require("../controllers/usersCotroller")
const verifyJWT = require("../middleware/verfyJWT")

router.use(verifyJWT)
router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
//patch
//delete

module.exports = router
