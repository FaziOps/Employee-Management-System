const { verifyToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

// Protects a route: requires a valid JWT in the Authorization header
// (format: "Bearer <token>"). Attaches the decoded payload to req.user.
function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "Authentication required. No token provided.");
    }

    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Session expired. Please log in again."));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token."));
    }
    next(err);
  }
}

// Restricts a route to specific roles. Use after requireAuth.
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action."));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
