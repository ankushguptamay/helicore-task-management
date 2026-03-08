const db = require("../models");

const getTasks = async (req) => {
  const { page, limit, status, priority } = req.query;
  const recordLimit = parseInt(limit) || 10;

  let offset = 0;
  let currentPage = 1;

  if (page) {
    currentPage = parseInt(page);
    offset = (currentPage - 1) * recordLimit;
  }

  const where = {};

  if (req.user.role === "user") {
    where.assignedTo = req.user.id;
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  const [tasks, totalTask] = await Promise.all([
    db.Task.findAll({
      where,
      limit: recordLimit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.User,
          as: "assignee",
          attributes: ["id", "name"],
        },
      ],
    }),

    db.Task.count({ where }),
  ]);

  return {
    data: tasks,
    totalPage: Math.ceil(totalTask / recordLimit),
    currentPage,
    totalRecords: totalTask,
  };
};

const updateTasks = async (taskId, payload, user) => {
  const task = await db.Task.findOne({ where: { id: taskId } });

  if (!task) {
    throw new Error("Task not found");
  }

  // USER can only update status
  if (user.role === "user") {
    if (!payload.status) {
      throw new Error("User can only update task status");
    }

    await task.update({
      status: payload.status,
    });

    return task;
  }

  // ADMIN full update
  if (user.role === "admin") {
    await task.update(payload);
    return task;
  }

  throw new Error("Unauthorized");
};

module.exports = {
  getTasks,
  updateTasks,
};
