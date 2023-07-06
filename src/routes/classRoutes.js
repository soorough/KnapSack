const express = require("express");
const router = express.Router( {mergeParams: true });
const classControllers = require("../controllers/classControllers");
const { isProfessorOrAdmin, isAny } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const Class = require("../models/Class");
const { v4: uuid4 } = require("uuid");


let storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// initialize the upload variable
const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// check file type
function checkFileType(file, cb) {
    // allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;

    // check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // check mimetype
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb("Error: Images Only");
    }
}


router.get("/", isAny, classControllers.allClasses);

// professor only
router.get("/add", isProfessorOrAdmin, classControllers.addClass_get);

// professor only
router.post("/add", isProfessorOrAdmin, (req, res) => {
    upload(req, res, async (err) => {
        // Validate Request
        if (!req.file) {
            return res.json({ error: "All fields are required" });
        }

        if (err) {
            return res.status(500).send({ error: err.message });
        }

        const user = res.locals.user;

        const { module, description } = req.body;

        // Store in Database
        try {
            const cls = Class.create({
                id: uuid4(),
                module,
                by: user,
                image: "uploads/" + req.file.filename,
            });

            if (cls) {
                return res.redirect("/classes/");
            } else {
                throw Error("Could Not Create the Class");
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    });
});

router.use("/:id", require("./class.idRoutes"));

module.exports = router;
