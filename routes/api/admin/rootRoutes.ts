import express from "express";

var router = express.Router();

router.use("/category", require("./categoryRoutes"));
router.use("/food", require("./foodRoutes"));
router.use("/setting", require("./settingRoutes"));
router.use("/orderState", require("./orderStateRoutes"));

module.exports = router;
