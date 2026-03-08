const express = require("express");
const router = express.Router();
const { successResponse } = require("../utils/response");
const v1Apis = require("./v1");

// Health Check
router.get("/health", (req, res) => {
  return successResponse(
    res,
    {
      uptime: process.uptime(),
      status: "OK",
      timestamp: new Date().toISOString(),
    },
    "Server is healthy",
  );
});

// V1 Routes
router.use("/v1", v1Apis);

module.exports = router;
