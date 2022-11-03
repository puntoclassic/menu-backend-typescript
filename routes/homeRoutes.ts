import express, { Request, Response } from "express";
var router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.end("Api works");
});

module.exports = router;
