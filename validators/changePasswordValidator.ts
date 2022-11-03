import { body } from "express-validator";
import userService from "../services/userService";

export default [
  body("currentPassword")
    .notEmpty().withMessage("Il campo password attuale non può essere vuoto")
    .bail()
    .custom(async (value, { req }) => {
      if (
        !await userService.validateLogin(
          req.body.email,
          value,
        )
      ) {
        throw new Error("Password incorrect");
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }).withMessage("Le password attuale è errata"),
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
