const db = require("../models");
const { Op } = require("sequelize");

exports.storeToken = async (user_id, refreshToken) => {
  await db.User_Token.create({
    user_id,
    refresh_token: refreshToken,
    refresh_expires_at: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
  });
  return null;
};

exports.findValidToken = async (refreshToken) => {
  const token = await db.User_Token.findOne({
    where: {
      refresh_token: refreshToken,
      refresh_expires_at: {
        [Op.gt]: new Date(),
      },
      is_revoked: false,
    },
    raw: true,
  });
  if (token) {
    return token;
  } else {
    return false;
  }
};
