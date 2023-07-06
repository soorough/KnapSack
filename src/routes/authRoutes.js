const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const { isAdmin, isUser, loginMiddleware } = require("../middlewares/authMiddleware");

router.get("/login", loginMiddleware, authControllers.login_get);

router.post("/login", loginMiddleware, authControllers.login_post);

router.get("/logout", isUser, authControllers.logout);

// admin only
router.get("/signup", isUser, isAdmin, authControllers.signup_get);

// admin only
router.post("/signup", isUser, isAdmin, authControllers.signup_post);

module.exports = router;
