import express, { Request, Response } from "express";

var router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ "status": "works" });
});

module.exports = router;
