const { validateTask } = require("../middlewares/Validation/task.validation");
const db = require("../models");
const { getTasks, updateTasks } = require("../services/task.service");
const { failureResponse, successResponse } = require("../utils/response");

exports.createTask = async (req, res) => {
  try {
    const { error } = validateTask(req.body);
    if (error) return failureResponse(res, error.details[0].message, 400);

    const { title, description, priority, assignedTo, dueDate } = req.body;
    const task = await db.Task.create({
      title,
      description,
      priority,
      assignedTo,
      dueDate: new Date(dueDate),
      createdBy: req.user.id,
    });
    return successResponse(res, { task }, "Task created successfully", 201);
  } catch (err) {
    return failureResponse(res, err.message || "Failed to create task!", 500);
  }
};

exports.tasks = async (req, res) => {
  try {
    const result = await getTasks(req);

    return successResponse(res, result, "Successfully", 200);
  } catch (err) {
    return failureResponse(res, err.message || "Failed to fetch task!", 500);
  }
};

exports.taskDetails = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const where = { id };
    if (req.user.role === "user") {
      where.assignedTo = req.user.id;
    }
    const result = await db.Task.findOne({
      where,
      include: [
        {
          model: db.User,
          as: "assignee",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      raw: true,
    });
    if (!result) return failureResponse(res, "This task is not present!", 400);
    return successResponse(res, result, "Successfully", 200);
  } catch (err) {
    return failureResponse(
      res,
      err.message || "Failed to fetch task details!",
      500,
    );
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const result = await updateTasks(taskId, req.body, req.user);

    return successResponse(res, result, "Task updated", 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const result = db.Task.findOne({
      where: { id },
    });
    if (!result) return failureResponse(res, "This task is not present!", 400);
    await result.destroy();
    return successResponse(res, result, "Task deleted successfully", 201);
  } catch (err) {
    return failureResponse(res, err.message || "Failed to delete task!", 500);
  }
};
