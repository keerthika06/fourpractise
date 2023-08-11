const databaseConnect = () => {
    const mongoose = require("mongoose")
    mongoose.set("strictQuery",true)
    const mongoDbURL = process.env.DB_URL.toString()
    mongoose.connect(mongoDbURL).then(console.log("CONNECTED"))
    .catch((err)=> console.log(err))

}
module.exports = databaseConnect