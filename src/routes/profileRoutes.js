const express = require("express");
const router = express.Router({ mergeParams: true });
const profileControllers = require("../controllers/profileControllers");
const { isAny, isAdmin } = require("../middlewares/authMiddleware");

router.get("/:username", isAny, profileControllers.showProfile);
router.post("/:username/update", isAny, profileControllers.updateProfile);
router.post("/:username/delete", isAdmin, profileControllers.deleteProfile);

module.exports = router;