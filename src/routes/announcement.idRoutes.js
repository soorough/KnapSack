const express = require("express");
const router = express.Router();
const announcementIdControllers = require("../controllers/announcement.idControllers");

router.get("/", announcementIdControllers.announcmentDetails);

// professor only
router.get("/edit", announcementIdControllers.editAnnouncement_get);

// professor only
router.post("/edit", announcementIdControllers.editAnnouncement_post);

// professor only
router.post("/delete", announcementIdControllers.deleteAnnouncement);

module.exports = router;
