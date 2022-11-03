import { body } from "express-validator";
import categoryService from "../services/categoryService";

export default [
  body("id").notEmpty(),
  body("name")
    .notEmpty().withMessage("Il nome del cibo non può essere vuoto"),
  body("price").notEmpty().withMessage("Il campo prezzo non può essere vuoto")
    .bail().isNumeric().withMessage(
      "Il campo prezzo può contenere solo numeri",
    ),
  body("category_id").notEmpty().withMessage(
    "Il campo categoria è obbligatorio",
  ).bail().custom(async (value, { req }) => {
    if (!await categoryService.checkCategoryExists(parseInt(value))) {
      throw new Error("Email exists");
    }
    return true;
  }).withMessage("Categoria non esistente"),
];
