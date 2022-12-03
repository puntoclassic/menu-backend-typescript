import express from "express";
import requireApiLogged from "../../../policies/requireApiLogged";
import requireApiRole from "../../../policies/requireApiRole";

var router = express.Router();

router.use(requireApiLogged);
router.use(requireApiRole("admin"));

router.use("/category", require("./categoryRoutes"));
router.use("/food", require("./foodRoutes"));
router.use("/setting", require("./settingRoutes"));
router.use("/orderState", require("./orderStateRoutes"));

module.exports = router;
