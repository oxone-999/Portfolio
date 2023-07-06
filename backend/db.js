const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async function main() {
    try{
        await mongoose.connect(process.env.DB, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    }catch(err){
        console.log(err);
    }
}