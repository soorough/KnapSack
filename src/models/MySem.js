const mongoose = require("mongoose");

const MySemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    module: {
        type: mongoose.Types.ObjectId,
        ref: "Class",
        required: true
    }
});

module.exports = new mongoose.model("MySem", MySemSchema);