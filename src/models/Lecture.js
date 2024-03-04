const importModule = async () => {
    const { default: stripHTML } = await import("string-strip-html");
    return stripHTML;
  };
const mongoose = require("mongoose");
const domPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const htmlPurify = domPurifier(new JSDOM().window);

const LectureSchema = new mongoose.Schema(
    {
        lectureNo: {
            type: Number,
            required: true,
            default: 0
        },
        name: {
            type: String,
            required: true,
        },
        body: {
            type: String,
        },
        snippet: {
            type: String,
        },
        cls: {
            type: mongoose.Types.ObjectId,
            ref: "Class",
            required: true,
        },
    },
    { timestamps: true }
);

LectureSchema.pre("validate", function(next) {
    if (this.body) {
        this.body = htmlPurify.sanitize(this.body);
        this.snippet = stripHTML(this.body.substring(0, 200)).result;
    }
    
    next();
})

module.exports = new mongoose.model("Lecture", LectureSchema);
