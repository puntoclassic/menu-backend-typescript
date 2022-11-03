import express, { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { validationResult } from "express-validator";
import { unlink } from "fs";
import path from "path";
import { rootPath } from "../../../app";
import requireApiRole from "../../../policies/requireApiRole";
import categoryService from "../../../services/categoryService";
import categoryValidator from "../../../validators/categoryValidator";

var router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { search, page, perPage, orderBy, ascend, paginated } = req.body;

  res.json(
    await categoryService.search(
      {
        search: search ?? "",
        page: parseInt((page ?? "1") as string),
        perPage: parseInt((perPage ?? "5") as string),
        orderBy: orderBy as string ?? "id",
        ascend: (ascend ?? true) == true,
        paginated: paginated ?? true,
      },
    ),
  );
});

//create category
router.post(
  "/create",
  requireApiRole("admin"),
  categoryValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(500).json({
        "status": "error",
        "fields": errors.mapped(),
      });
    } else {
      const { name } = req.body;

      var category = await categoryService.createCategory({
        name: name,
      });

      if (req.files?.image) {
        const image: UploadedFile = req.files!.image as UploadedFile;
        if (category.id) {
          var nameSplitted = image.name.split(".");

          var url = "public/assets/images/c/" + category.id + "." +
            nameSplitted[nameSplitted.length - 1];
          var file_path = path.join(rootPath, url);
          image.mv(file_path, function (err) {});
          await categoryService.updateImageUrl(url, category.id);
        }
      }

      res.status(200).json({
        "status": "success",
      });
    }
  },
);

//update category and upload image
router.post(
  "/update",
  requireApiRole("admin"),
  categoryValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(500).json({
        "status": "error",
        "fields": errors.mapped(),
      });
    } else {
      const { id, name } = req.body;

      var category = await categoryService.updateCategory(parseInt(id), {
        name: name,
      });

      if (req.files?.image) {
        if (category.image_url) {
          //delete current file
          var old_file = path.join(rootPath, category.image_url!);
          unlink(old_file, () => {});
        }

        const image: UploadedFile = req.files!.image as UploadedFile;
        var nameSplitted = image.name.split(".");

        var url = "public/assets/images/c/" + category.id + "." +
          nameSplitted[nameSplitted.length - 1];
        var file_path = path.join(rootPath, url);

        image.mv(file_path, function (err) {});

        await categoryService.updateImageUrl(url, parseInt(id));
      }

      res.status(200).json({
        "status": "success",
      });
    }
  },
);

//delete category and delete image
router.post(
  "/delete",
  requireApiRole("admin"),
  async (req: Request, res: Response) => {
    const { id } = req.body;

    var category = await categoryService.deleteCategory(parseInt(id));

    if (category.image_url) {
      var old_file = path.join(rootPath, category.image_url!);
      unlink(old_file, () => {});
    }

    res.status(200).json({
      "status": "success",
    });
  },
);

module.exports = router;
