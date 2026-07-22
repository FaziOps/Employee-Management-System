const asyncHandler = require("../utils/asyncHandler");
const batchService = require("../services/batch.service");

const createBatch = asyncHandler(async (req, res) => {
  const batch = await batchService.createBatch(req.body);
  res.status(201).json({ success: true, message: "Batch created.", data: batch });
});

const getAllBatches = asyncHandler(async (req, res) => {
  const result = await batchService.getAllBatches(req.query);
  res.status(200).json({ success: true, data: result });
});

const getBatchById = asyncHandler(async (req, res) => {
  const batch = await batchService.getBatchById(req.params.id);
  res.status(200).json({ success: true, data: batch });
});

const updateBatch = asyncHandler(async (req, res) => {
  const batch = await batchService.updateBatch(req.params.id, req.body);
  res.status(200).json({ success: true, message: "Batch updated.", data: batch });
});

const deleteBatch = asyncHandler(async (req, res) => {
  await batchService.deleteBatch(req.params.id);
  res.status(200).json({ success: true, message: "Batch deleted." });
});

module.exports = { createBatch, getAllBatches, getBatchById, updateBatch, deleteBatch };
