import { body } from "express-validator";

export default [
  body("firstname")
    .notEmpty().withMessage("Il campo nome non può essere vuoto")
    .isString().withMessage("Il campo nome può contenere solo lettere"),
  body("lastname")
    .notEmpty().withMessage("Il campo cognome non può essere vuoto")
    .isString().withMessage("Il campo cognome può contenere solo lettere"),
];
