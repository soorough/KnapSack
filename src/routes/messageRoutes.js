const express = require("express");
const router = express.Router({mergeParams: true});
const messageControllers = require("../controllers/messageControllers");

router.post("/", messageControllers.saveMessage);

module.exports = router;