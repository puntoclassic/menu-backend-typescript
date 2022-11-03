import { body } from "express-validator";

export default [
  body("name")
    .notEmpty().withMessage("Il nome è obbligatorio"),
  body("value")
    .notEmpty().withMessage("Il valore è obbligatorio"),
];
