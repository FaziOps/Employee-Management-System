const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { signToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

async function register({ name, email, password, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: role || "ADMIN" },
  });

  return sanitizeUser(user);
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token, user: sanitizeUser(user) };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found.");
  return sanitizeUser(user);
}

// Never return the password hash to the client.
function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

module.exports = { register, login, getProfile };
