const asyncHandler = require("../utils/asyncHandler");
const interneeService = require("../services/internee.service");

const createInternee = asyncHandler(async (req, res) => {
  const internee = await interneeService.createInternee(req.body);
  res.status(201).json({ success: true, message: "Internee created.", data: internee });
});

const getAllInternees = asyncHandler(async (req, res) => {
  const result = await interneeService.getAllInternees(req.query);
  res.status(200).json({ success: true, data: result });
});

const getInterneeById = asyncHandler(async (req, res) => {
  const internee = await interneeService.getInterneeById(req.params.id);
  res.status(200).json({ success: true, data: internee });
});

const updateInternee = asyncHandler(async (req, res) => {
  const internee = await interneeService.updateInternee(req.params.id, req.body);
  res.status(200).json({ success: true, message: "Internee updated.", data: internee });
});

const deleteInternee = asyncHandler(async (req, res) => {
  await interneeService.deleteInternee(req.params.id);
  res.status(200).json({ success: true, message: "Internee deleted." });
});

module.exports = {
  createInternee,
  getAllInternees,
  getInterneeById,
  updateInternee,
  deleteInternee,
};
