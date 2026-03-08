"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: "assignedTo",
        as: "assignee",
      });

      Task.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
      });
    }
  }

  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.ENUM("PENDING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"),
        defaultValue: "PENDING",
      },

      priority: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
        defaultValue: "MEDIUM",
      },

      assignedTo: {
        type: DataTypes.INTEGER,
      },

      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "tasks",
      timestamps: true,
    },
  );

  return Task;
};
