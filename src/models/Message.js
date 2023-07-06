const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    cls: {
        type: mongoose.Types.ObjectId,
        ref: "Class",
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = new mongoose.model("Message", MessageSchema);