const redisClient = require("../config/redis");

const setTokenInRedis = async (token, user_id) => {
  const ttl = 7 * 60; // 7 min
  await redisClient.set(`token:${token}`, user_id, { EX: ttl });
};

const getTokenInRedis = async (token) => {
  const redisToken = await redisClient.get(`token:${token}`);
  return redisToken;
};

const deleteTokenInRedis = async (token) => {
  await redisClient.del(`token:${token}`);
  return true;
};

module.exports = { setTokenInRedis, getTokenInRedis, deleteTokenInRedis };
