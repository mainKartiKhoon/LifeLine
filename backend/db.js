const mongoose = require("mongoose");


function connectDb() {
    mongoose.connect("mongodb://localhost:27017/lifeline")
        .then(() => {
            console.log("Mongodb connection Successful!");
        })
        .catch((err) => {
            console.log("Error while mongodb connection", err)
        })
}

module.exports = {
    connectDb
}