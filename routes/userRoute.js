let express = require("express")
let router = express.Router()

const { createUser, getUser, getAllUsers, deleteUser, updateUser, updateData, otpLogin, verifyOtp, validateToken } = require("../controllers/userController")



router.post("/", createUser)

router.post("/login", getUser)

router.post("/otp-login", otpLogin)

router.post("/verify-otp", verifyOtp)

router.get("/get-all-users", getAllUsers)

router.delete("/:id", deleteUser)

router.patch("/:id", updateUser)

router.put("/:id", updateData)




module.exports = router;