const express = require("express");
const router = express.Router({ mergeParams: true });
const classIdControllers = require("../controllers/class.idControllers");
const { isProfessorOrAdmin, isAny } = require("../middlewares/authMiddleware");

router.get("/", isAny, classIdControllers.classDetails);

router.get("/discussions", isAny, classIdControllers.classForum);

// professor only
router.get("/delete", isProfessorOrAdmin, classIdControllers.deleteClass);

// professor only
router.get("/edit", isProfessorOrAdmin, classIdControllers.editClass_get);

// professsor only
router.post("/edit", isProfessorOrAdmin, classIdControllers.editClass_post);

// professor only
router.get("/addlecture", isProfessorOrAdmin, classIdControllers.addLecture_get);

// professor only
router.post("/addlecture", isProfessorOrAdmin, classIdControllers.addLecture_post);

router.use("/:lid", require("../routes/lectureRoutes"));

module.exports = router;
