import { body } from "express-validator";

export default [
  body("name")
    .notEmpty().withMessage("Il nome della categoria non può essere vuoto")
    .bail()
    .isString().withMessage("Il nome non può contenere numeri"),
];
