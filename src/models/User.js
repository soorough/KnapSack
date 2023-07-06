const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is Required"],
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
        minLength: [6, "Password Too Short"],
        required: [true, "Password is Required"],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: "student",
        enum: ["student", "professor", "admin"]
    },
});

const User = new mongoose.model("User", UserSchema);

module.exports = User;
