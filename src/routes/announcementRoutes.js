const express = require("express");
const router = express.Router();
const announcementControllers = require("../controllers/announcementControllers");

router.get("/", announcementControllers.allAnnouncements);

// professor only
router.get("/add", announcementControllers.addAnnouncement_get);

// professor only
router.post("/add", announcementControllers.addAnnouncement_post);

router.use("/:aid", require("./announcement.idRoutes"));

module.exports = router;