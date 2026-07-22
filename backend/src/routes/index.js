const express = require("express");
const authRoutes = require("./auth.routes");
const batchRoutes = require("./batch.routes");
const interneeRoutes = require("./internee.routes");
const tenureRoutes = require("./tenure.routes");
const assetRoutes = require("./asset.routes");

const router = express.Router();

router.get("/health", (req, res) => res.json({ success: true, message: "EMS API is running." }));

router.use("/auth", authRoutes);
router.use("/batches", batchRoutes);
router.use("/internees", interneeRoutes);
router.use("/tenures", tenureRoutes);
router.use("/assets", assetRoutes);

module.exports = router;
