const {User } = require("../models/index")
const bcrypt = require("bcrypt")
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const {mongoose} = require("mongoose")
//const cloudinary = 