import express, { Request, Response } from "express";
import foodService from "../../services/foodService";

var router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.json(
    await foodService.getAll(
      {
        paginate: true,
        page: parseInt(req.query.page as string ?? 1),
        perPage: parseInt(req.query.perPage as string ?? 5),
      },
    ),
  );
});

router.get("/byCategorySlug", async (req: Request, res: Response) => {
  res.json(
    await foodService.getByCategorySlug(
      {
        categorySlug: req.query.slug as string,
        paginated: true,
        page: parseInt(req.query.page as string ?? 1),
        perPage: parseInt(req.query.perPage as string ?? 5),
      },
    ),
  );
});

router.get("/cerca", async (req: Request, res: Response) => {
  var { search } = req.query;
  search = search as string;

  if (search == "") {
    res.json(
      { foods: [] },
    );
  } else {
    var { page, perPage, orderBy, ascend } = req.query;

    res.json(
      await foodService.search(
        {
          search: search ?? "",
          page: parseInt(page as string ?? 1),
          perPage: parseInt(perPage as string ?? 100),
          orderBy: orderBy as string ?? "id",
          ascend: (ascend ?? true) == true,
          paginated: (page != null && perPage != null),
        },
      ),
    );
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  if (req.params.id) {
    res.json(
      await foodService.getById(parseInt(req.params.id)) ?? {},
    );
  } else {
    res.json({});
  }
});

module.exports = router;
