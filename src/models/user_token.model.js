"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User_Token extends Model {
    static associate(models) {
      User_Token.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }

  User_Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      refresh_token: {
        type: DataTypes.STRING,
      },

      refresh_expires_at: {
        type: DataTypes.DATE,
      },

      is_revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User_Token",
      tableName: "user_tokens",
      timestamps: true,
    },
  );

  return User_Token;
};
