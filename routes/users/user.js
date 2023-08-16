const express = require("express")
const router =express.Router()
const  {body} = require("express-validator")
const userController = require("../../controller/userController")
const verifyJwt = require("../../middleware/verifyJWT")
const checkUserLoggedIn = require("../../middleware/checkUserLoggedIN")
const upload = require("../../utils/multer")

router.route("/").post(userController.register)
router.route("/login").post(userController.login).delete(userController.logout)

router.route("/updateProfilePic")