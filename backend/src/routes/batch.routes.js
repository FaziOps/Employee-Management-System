const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const batchController = require("../controllers/batch.controller");

const router = express.Router();

router.use(requireAuth); // every batch route requires a logged-in user

const batchValidation = [
  body("name").trim().notEmpty().withMessage("Batch name is required."),
  body("domain").trim().notEmpty().withMessage("Domain is required."),
  body("startDate").isISO8601().withMessage("Valid start date is required."),
  body("endDate").isISO8601().withMessage("Valid end date is required."),
];

router.post("/", batchValidation, validate, batchController.createBatch);
router.get("/", batchController.getAllBatches);
router.get("/:id", batchController.getBatchById);
router.put("/:id", batchController.updateBatch);
router.delete("/:id", batchController.deleteBatch);

module.exports = router;
