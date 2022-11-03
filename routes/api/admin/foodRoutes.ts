import { Prisma } from "@prisma/client";
import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import requireApiRole from "../../../policies/requireApiRole";
import foodService from "../../../services/foodService";
import foodValidator from "../../../validators/foodValidator";
import updateFoodValidator from "../../../validators/updateFoodValidator";
var router = express.Router();

//get paginated
router.post("/", async (req: Request, res: Response) => {
  const { search, page, perPage, orderBy, ascend } = req.body;
  res.json(
    await foodService.search(
      {
        search: search ?? "",
        page: parseInt(page),
        perPage: parseInt(perPage),
        orderBy: orderBy,
        ascend: (ascend ?? true) == true,
        paginated: (page != null && perPage != null),
      },
    ),
  );
});

//create food
router.post(
  "/create",
  requireApiRole("admin"),
  foodValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(500).json({
        "status": "error",
        "fields": errors.mapped(),
      });
    } else {
      const { name, ingredients, price, category_id } = req.body;

      var data: Prisma.foodCreateInput = {
        name: name,
        price: price as number,
        ingredients: ingredients ?? "",
        category: {
          connect: {
            id: parseInt(category_id),
          },
        },
      };

      try {
        await foodService.create(data);

        res.status(200).json({
          "status": "success",
        });
      } catch (e) {
        console.log(e);
        res.status(500).json({
          "status": "error",
        });
      }
    }
  },
);

//update food
router.post(
  "/update",
  requireApiRole("admin"),
  updateFoodValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(500).json({
        "status": "error",
        "fields": errors.mapped(),
      });
    } else {
      const { id, name, ingredients, price, category_id } = req.body;

      await foodService.update(
        parseInt(id),
        {
          name: name,
          ingredients: ingredients ?? "",
          price: price as number,
          category: {
            connect: {
              id: parseInt(category_id),
            },
          },
        },
      );

      res.status(200).json({
        "status": "success",
      });
    }
  },
);

//delete food
router.post(
  "/delete",
  requireApiRole("admin"),
  async (req: Request, res: Response) => {
    if (req.body.id) {
      await foodService.deleteSingle(parseInt(req.body.id));
      res.status(200).json({
        "status": "success",
      });
    } else {
      res.status(500).json({
        "status": "error",
        "fields": {
          "id": "missing",
        },
      });
    }
  },
);

module.exports = router;
