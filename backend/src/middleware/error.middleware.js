const ApiError = require("../utils/ApiError");

// 404 handler - reached when no route matched
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Central error handler - every controller/service error ends up here
// via next(err) or asyncHandler.
function errorHandler(err, req, res, next) {
  let { statusCode, message, details } = err;

  // Prisma known errors we want to translate into friendly responses
  if (err.code === "P2002") {
    statusCode = 409;
    message = `A record with this ${err.meta?.target?.join(", ") || "value"} already exists.`;
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = "The requested record was not found.";
  } else if (err.code === "P2003") {
    statusCode = 400;
    message = "This action violates a related-record constraint (check foreign keys).";
  }

  statusCode = statusCode || 500;
  message = message || "Internal Server Error";

  if (process.env.NODE_ENV === "development" && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: details || undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

module.exports = { notFound, errorHandler };
