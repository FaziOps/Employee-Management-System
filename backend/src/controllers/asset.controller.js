const asyncHandler = require("../utils/asyncHandler");
const assetService = require("../services/asset.service");

const createAsset = asyncHandler(async (req, res) => {
  const asset = await assetService.createAsset(req.body);
  res.status(201).json({ success: true, message: "Asset created.", data: asset });
});

const getAllAssets = asyncHandler(async (req, res) => {
  const result = await assetService.getAllAssets(req.query);
  res.status(200).json({ success: true, data: result });
});

const getAssetById = asyncHandler(async (req, res) => {
  const asset = await assetService.getAssetById(req.params.id);
  res.status(200).json({ success: true, data: asset });
});

const updateAsset = asyncHandler(async (req, res) => {
  const asset = await assetService.updateAsset(req.params.id, req.body);
  res.status(200).json({ success: true, message: "Asset updated.", data: asset });
});

const returnAsset = asyncHandler(async (req, res) => {
  const asset = await assetService.returnAsset(req.params.id);
  res.status(200).json({ success: true, message: "Asset marked as returned.", data: asset });
});

const deleteAsset = asyncHandler(async (req, res) => {
  await assetService.deleteAsset(req.params.id);
  res.status(200).json({ success: true, message: "Asset deleted." });
});

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  returnAsset,
  deleteAsset,
};
