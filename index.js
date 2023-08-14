const express = require("express")
const router = express.Router();
const databaseConnect = require("./config/databaseconnection");
const fileupload = require("express-fileupload");
const path = require("path");

const port =process.env.PORT || 5000

require("dotenv").config()

const app = express()
app.use(express.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("welcome")
})
databaseConnect()

app.use("/",router)

app.listen(port,() => console.log(`Running on port no ${port}`))
