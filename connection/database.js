const mongoose = require('mongoose')
require("dotenv").config()

const connectDb = async () => {
    try {
        if(!process.env.MONGODB_URL){
            console.log("MONGODB_URL is variable is not defined.");
        }
        await mongoose.connect(process.env.MONGODB_URL)
    } catch (error) {
        console.log("Error connecting to database.", error);
        process.exit(1)   
    }
}

module.exports = connectDb