const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const tenureController = require("../controllers/tenure.controller");

const router = express.Router();

router.use(requireAuth);

const tenureValidation = [
  body("internConId").isInt().withMessage("A valid internee id is required."),
  body("batchId").isInt().withMessage("A valid batch id is required."),
  body("startDate").isISO8601().withMessage("Valid start date is required."),
  body("endDate").isISO8601().withMessage("Valid end date is required."),
];

router.post("/", tenureValidation, validate, tenureController.createTenure);
router.get("/", tenureController.getAllTenures);
router.get("/:id", tenureController.getTenureById);
router.put("/:id", tenureController.updateTenure);
router.delete("/:id", tenureController.deleteTenure);

module.exports = router;
