const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({ success: true, message: "Account created.", data: user });
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  res.status(200).json({ success: true, message: "Login successful.", data: { token, user } });
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.status(200).json({ success: true, data: user });
});

module.exports = { register, login, me };
