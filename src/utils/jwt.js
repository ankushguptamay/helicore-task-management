const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_SECRET || "supersecretkey";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || ACCESS_SECRET;

const signAccessToken = (userId, role) => {
  const expiresIn = "7m";
  const token = jwt.sign({ id: userId, role }, ACCESS_SECRET, { expiresIn });
  return token;
};

const signRefreshToken = (userId) => {
  const token = jwt.sign({ id: userId }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, ACCESS_SECRET);
  return decoded;
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
