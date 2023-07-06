const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = new mongoose.model("Announcement", AnnouncementSchema);
