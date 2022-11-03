import express, { Request, Response } from "express";

var router = express.Router();

router.get("/cookie", (req: Request, res: Response) => {
  res.json(req.cookies["cart"] || {});
});

router.post("/cookie", (req: Request, res: Response) => {
  const { cart } = req.body;

  res.cookie("cart", cart);

  res.json(req.cookies["cookie"] || {});
});

module.exports = router;
