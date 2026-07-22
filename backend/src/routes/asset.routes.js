const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const assetController = require("../controllers/asset.controller");

const router = express.Router();

router.use(requireAuth);

const assetValidation = [
  body("assetTag").trim().notEmpty().withMessage("Asset tag is required."),
  body("name").trim().notEmpty().withMessage("Asset name is required."),
  body("type")
    .isIn(["LAPTOP", "MONITOR", "ACCESSORY", "ID_CARD", "OTHER"])
    .withMessage("Invalid asset type."),
];

router.post("/", assetValidation, validate, assetController.createAsset);
router.get("/", assetController.getAllAssets);
router.get("/:id", assetController.getAssetById);
router.put("/:id", assetController.updateAsset);
router.patch("/:id/return", assetController.returnAsset);
router.delete("/:id", assetController.deleteAsset);

module.exports = router;
