const express = require("express");
const router = express.Router({mergeParams: true});
const mysemControllers = require("../controllers/mysemControllers.js");

router.get("/", mysemControllers.mysem_get);
router.post("/:id/add", mysemControllers.mysem_post);
router.post("/:id/remove", mysemControllers.mysem_delete);

module.exports = router;