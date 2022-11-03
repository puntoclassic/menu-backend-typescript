import { body } from "express-validator";
import userService from "../services/userService";

export default [
  body("email")
    .notEmpty().withMessage("Il campo email non può essere vuoto")
    .bail()
    .isEmail().withMessage("Insersci un indirizzo email valido")
    .custom(async (value, { req }) => {
      if (await userService.checkEmailExists(value)) {
        throw new Error("Email exists");
      }
      return true;
    }).withMessage("Indirizzo email in uso"),
  body("firstname")
    .notEmpty().withMessage("Il campo nome non può essere vuoto")
    .isString().withMessage("Il campo nome può contenere solo lettere"),
  body("lastname")
    .notEmpty().withMessage("Il campo cognome non può essere vuoto")
    .isString().withMessage("Il campo cognome può contenere solo lettere"),
  body("password")
    .notEmpty().withMessage("Il campo password non può essere vuoto")
    .bail()
    .matches(
      RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),
    ).withMessage(
      "La password deve essere lunga almeno 8 caratteri e contenere: 1 lettera maiuscola, 1 numero, 1 carattere speciale",
    ),
  body("confirmPassword")
    .notEmpty().withMessage("Il campo conferma password non può essere vuoto")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password not match");
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }).withMessage("Le due password devono corrispondere"),
];
