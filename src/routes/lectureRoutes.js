const express = require("express");
const router = express.Router( { mergeParams: true });
const lectureControllers = require("../controllers/lectureControllers");
const { isProfessorOrAdmin, isAny } = require("../middlewares/authMiddleware");

router.get("/", isAny, lectureControllers.showLecture);

// professor only
router.get("/delete", isProfessorOrAdmin, lectureControllers.deleteLecture);

// professor only
router.get("/edit", isProfessorOrAdmin, lectureControllers.editLecture_get);

// professor only
router.post("/edit", isProfessorOrAdmin, lectureControllers.editLecture_post);

module.exports = router;