import express, { Request, Response } from "express";

var router = express.Router();

router.use("/categories", require("./categoryRoutes"));
router.use("/foods", require("./foodRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/account", require("./accountRoutes"));
router.use("/cart", require("./cartRoutes"));

//admin routes
router.use("/admin", require("./admin/rootRoutes"));

module.exports = router;
