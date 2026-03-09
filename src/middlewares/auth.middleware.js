const jwt = require("jsonwebtoken");
const { failureResponse } = require("../utils/response");
const { verifyToken } = require("../utils/jwt");
const { getTokenInRedis } = require("../utils/redis");

exports.authToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  if (!token) {
    return failureResponse(res, "Not authorized to access this route", 401);
  }
  try {
    const decoded = verifyToken(token);
    // Redis
    const redisToken = await getTokenInRedis(decoded.jti);
    if (!redisToken) {
      return res.status(401).json({ message: "Token expired or revoked" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return failureResponse(
      res,
      "Not authorized to access this route",
      401,
      err.message,
    );
  }
};

exports.onlyAdmin = async (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return failureResponse(
      res,
      "Not authorized to access this route",
      401,
      err.message,
    );
  }
};
