const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        module: {
            type: String,
            required: true,
        },
        by: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String
        },
        syllabus: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = new mongoose.model("Class", ClassSchema);
