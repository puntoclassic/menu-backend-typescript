import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import requireApiRole from "../../../policies/requireApiRole";
import settingService from "../../../services/settingService";
import settingValidator from "../../../validators/settingValidator";

var router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.json(await settingService.fetchAll());
});

router.get(
  "/:name",
  async (req: Request, res: Response) => {
    const { name } = req.params;

    res.json(await settingService.getSetting(name) ?? {});
  },
);

router.post(
  "/",
  requireApiRole("admin"),
  async (req: Request, res: Response) => {
    await settingService.writeSettings(req.body);
    res.json({}).status(201);
  },
);

module.exports = router;
