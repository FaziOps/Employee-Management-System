const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate.middleware");
const { requireAuth } = require("../middleware/auth.middleware");
const interneeController = require("../controllers/internee.controller");

const router = express.Router();

router.use(requireAuth);

const interneeValidation = [
  body("fullName").trim().notEmpty().withMessage("Full name is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("phone").trim().notEmpty().withMessage("Phone number is required."),
  body("cnic").trim().notEmpty().withMessage("CNIC is required."),
];

router.post("/", interneeValidation, validate, interneeController.createInternee);
router.get("/", interneeController.getAllInternees);
router.get("/:id", interneeController.getInterneeById);
router.put("/:id", interneeController.updateInternee);
router.delete("/:id", interneeController.deleteInternee);

module.exports = router;
