const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const { authToken, onlyAdmin } = require("../../middlewares/auth.middleware");

router.post("/register", authToken, onlyAdmin, authController.registerUser);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/users", authToken, onlyAdmin, authController.users);

module.exports = router;
