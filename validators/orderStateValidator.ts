import { body } from "express-validator";

export default [
  body("name")
    .notEmpty().withMessage("Il nome dello stato non può essere vuoto"),
];
