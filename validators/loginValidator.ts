import { body } from "express-validator";

export default [
  body("email")
    .notEmpty().withMessage("Il campo email non può essere vuoto")
    .bail()
    .isEmail().withMessage("Insersci un indirizzo email valido"),
  body("password")
    .notEmpty().withMessage("Il campo password non può essere vuoto"),
];
