const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const task = require("./task.route");

router.use("/auth", authRoutes);
router.use("/task", task);

module.exports = router;