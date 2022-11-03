import express, { Request, Response } from "express";
import categoryService from "../../services/categoryService";
import foodService from "../../services/foodService";

var router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { page, perPage, orderBy, ascend, cached } = req.query;

  res.json(
    await categoryService.getAll(
      {
        paginated: (page != null && perPage != null),
        page: parseInt(page as string ?? 1),
        perPage: parseInt(perPage as string ?? 5),
        orderBy: orderBy as string,
        ascend: (ascend ?? "true") == "true",
        cached: (cached ?? "true") == "true",
      },
    ),
  );
});

router.get("/:id", async (req: Request, res: Response) => {
  if (req.params.id) {
    res.json(
      await categoryService.getById(parseInt(req.params.id)),
    );
  } else {
    res.json();
  }
});

router.get("/:id/foods", async (req: Request, res: Response) => {
  res.json(
    await foodService.getByCategory(parseInt(req.params.id as string)),
  );
});

router.get("/bySlug/:slug", async (req: Request, res: Response) => {
  res.json(
    await categoryService.getBySlug(req.params.slug as string),
  );
});

module.exports = router;
