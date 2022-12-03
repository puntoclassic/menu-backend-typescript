import express, { Request, Response } from "express";
import requireApiRole from "../../../policies/requireApiRole";
import settingService from "../../../services/settingService";

var router = express.Router();

router.post(
  "/",
  requireApiRole("admin"),
  async (req: Request, res: Response) => {
    await settingService.writeSettings(req.body);
    res.json({}).status(201);
  },
);

module.exports = router;
