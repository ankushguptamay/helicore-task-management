const {
  validateLogin,
  validateRegistration,
} = require("../middlewares/Validation/auth.validation");
const db = require("../models");
const { storeToken, findValidToken } = require("../services/token.service");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/password");
const { failureResponse, successResponse } = require("../utils/response");

const setTokenCookies = (res, accessToken, refreshToken, role = "user") => {
  const accessMaxAge = 7 * 60 * 1000;
  const refreshMaxAge = 7 * 24 * 60 * 60 * 1000;

  // determine if environment is production
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax", // Use 'none' for cross-domain in prod
    maxAge: accessMaxAge,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: refreshMaxAge,
  });
};

const clearTokenCookies = (res) => {
  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

// Only odmin can register
exports.registerUser = async (req, res) => {
  try {
    const { error } = validateRegistration(req.body);
    if (error) return failureResponse(res, error.details[0].message, 400);

    const { email, password, role = "user" } = req.body;

    const isUser = await db.User.findOne({ where: { email }, raw: true });
    if (isUser) return failureResponse(res, "Credentials already exist!", 400);

    const hashedPassword = await hashPassword(password);

    const user = await db.User.create({
      ...req.body,
      role,
      password: hashedPassword,
    });
    return successResponse(res, { user }, "User registered successfully", 201);
  } catch (err) {
    return failureResponse(res, err.message || "Failed to register user!", 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return failureResponse(res, error.details[0].message, 400);

    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email }, raw: true });
    if (!user) return failureResponse(res, "Invalid credentials!", 401);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return failureResponse(res, "Invalid credentials", 401);
    }
    // Generate tokens
    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id);
    await storeToken(user.id, refreshToken);
    delete user.password;
    setTokenCookies(res, accessToken, refreshToken, user.role);
    return successResponse(
      res,
      { user, accessToken, refreshToken },
      "Loged in successfully",
      201,
    );
  } catch (err) {
    return failureResponse(res, err.message || "Failed to Login!", 500);
  }
};

exports.logout = async (req, res) => {
  try {
    let token;
    if (req.cookies && req.cookies.refreshToken) {
      token = req.cookies.refreshToken;
    }
    const tokenRow = await findValidToken(token);
    if (tokenRow) {
      await db.User_Token.destroy({
        where: { id: tokenRow.id },
      });
    }

    clearTokenCookies(res);
    return successResponse(res, null, "Logged out successfully");
  } catch (error) {
    return failureResponse(res, "Logout failed", 500, error);
  }
};

exports.users = async (req, res) => {
  try {
    const { page, limit } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }

    // Count All User
    const [users, totalUser] = await Promise.all([
      db.User.findAll({
        limit: recordLimit,
        offset: offSet,
        order: [["createdAt", "DESC"]],
      }),
      db.User.count(),
    ]);
    return successResponse(
      res,
      {
        data: users,
        totalPage: Math.ceil(totalUser / recordLimit),
        currentPage,
      },
      "Successfully",
      200,
    );
  } catch (err) {
    return failureResponse(res, err.message || "Failed to get users!", 500);
  }
};
