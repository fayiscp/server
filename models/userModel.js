let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    password: {
        type: String
    },

    otp: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)






















