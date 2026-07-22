const asyncHandler = require("../utils/asyncHandler");
const tenureService = require("../services/tenure.service");

const createTenure = asyncHandler(async (req, res) => {
  const tenure = await tenureService.createTenure(req.body);
  res.status(201).json({ success: true, message: "Tenure created.", data: tenure });
});

const getAllTenures = asyncHandler(async (req, res) => {
  const result = await tenureService.getAllTenures(req.query);
  res.status(200).json({ success: true, data: result });
});

const getTenureById = asyncHandler(async (req, res) => {
  const tenure = await tenureService.getTenureById(req.params.id);
  res.status(200).json({ success: true, data: tenure });
});

const updateTenure = asyncHandler(async (req, res) => {
  const tenure = await tenureService.updateTenure(req.params.id, req.body);
  res.status(200).json({ success: true, message: "Tenure updated.", data: tenure });
});

const deleteTenure = asyncHandler(async (req, res) => {
  await tenureService.deleteTenure(req.params.id);
  res.status(200).json({ success: true, message: "Tenure deleted." });
});

module.exports = { createTenure, getAllTenures, getTenureById, updateTenure, deleteTenure };
