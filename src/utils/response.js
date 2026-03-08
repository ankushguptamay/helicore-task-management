const successResponse = (res, data, message = "Success", statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};
const failureResponse = (
  res,
  message = "Internal Server Error",
  statusCode = 500,
  error = null,
) => {
  const response = {
    success: false,
    message,
    error: error ? error.message || error : null,
  };
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  failureResponse,
};
