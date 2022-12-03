import express, { Request, Response } from "express";
import settingService from "../../services/settingService";

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

module.exports = router;
