const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Run this after an array of express-validator checks.
// Collects any validation failures into a single 400 response.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ApiError(400, "Validation failed.", details));
  }
  next();
}

module.exports = validate;
