const express = require("express");
const router = express.Router();
const taskCont = require("../../controllers/task.controller");
const { authToken, onlyAdmin } = require("../../middlewares/auth.middleware");

router.post("/", authToken, onlyAdmin, taskCont.createTask);
router.put("/:id", authToken, taskCont.updateTask);
router.delete("/:id", authToken, onlyAdmin, taskCont.deleteTask);
router.get("/", authToken, taskCont.tasks);
router.get("/:id", authToken, taskCont.taskDetails);

module.exports = router;
