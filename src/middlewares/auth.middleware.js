const jwt = require("jsonwebtoken");
const { failureResponse } = require("../utils/response");
const { verifyToken } = require("../utils/jwt");

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

    // Check that the token exists in DB and is not revoked/expired, for extra security. We can also implement redis here for log out or token revoked.
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
