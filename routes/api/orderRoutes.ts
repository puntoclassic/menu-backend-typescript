import express, { Request, Response } from "express";

var router = express.Router();

//create order

//show order detail

//generate order checkout id for stripe

//search orders

router.post("/createOrder", async (req: Request, res: Response) => {
  res.json({
    status: "Executed",
  });
});

module.exports = router;
