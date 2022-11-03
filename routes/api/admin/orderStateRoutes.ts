import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import requireApiRole from "../../../policies/requireApiRole";
import orderStateService from "../../../services/orderStateService";
import orderStateValidator from "../../../validators/orderStateValidator";

var router = express.Router();

router.get(
  "/",
  requireApiRole("admin"),
  async (req: Request, res: Response) => {
    res.json(
      await orderStateService.getAll({
        paginated: false,
        page: 1,
        perPage: 100,
        orderBy: "id",
        ascend: true,
      }),
    );
  },
);

router.get(
  "/:id",
  requireApiRole("admin"),
  async (req: Request, res: Response) => {
    res.json(
      await orderStateService.getSingle(parseInt(req.params.id)),
    );
  },
);

router.post(
  "/",
  requireApiRole("admin"),
  async (req: Request, res: Response) => {
    res.json(
      await orderStateService.search(
        {
          search: req.body.search ?? "",
          page: parseInt(req.body.page as string),
          perPage: parseInt(req.body.perPage as string),
          orderBy: req.body.orderBy as string,
          ascend: (req.body.ascend ?? true) == true,
          paginated: (req.body.page && req.body.perPage),
        },
      ),
    );
  },
);

router.post(
  "/create",
  requireApiRole("admin"),
  orderStateValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors.mapped());
    } else {
      const { name, cssBadgeClass } = req.body;

      res.json(
        await orderStateService.create({
          name: name,
          cssBadgeClass: cssBadgeClass,
        }),
      );
    }
  },
);

router.post(
  "/update",
  requireApiRole("admin"),
  orderStateValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors.mapped());
    } else {
      const { id, name, cssBadgeClass } = req.body;

      res.json(
        await orderStateService.update(parseInt(id), {
          name: name,
          cssBadgeClass: cssBadgeClass,
        }),
      );
    }
  },
);

router.post(
  "/delete",
  requireApiRole("admin"),
  async (req: Request, res: Response) => {
    const { id } = req.body;

    if (id) {
      res.json(await orderStateService.deleteOrderState(parseInt(id)));
    } else {
      res.json({}).status(500);
    }
  },
);

module.exports = router;
