import { body } from "express-validator";

export default [
  body("token")
    .notEmpty().withMessage("Il token è obbligatroio")
    .bail(),
  body("password")
    .notEmpty().withMessage("Il campo password non può essere vuoto")
    .bail()
    .matches(
      RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),
    ).withMessage(
      "La password deve essere lunga almeno 8 caratteri e contenere: 1 lettera maiuscola, 1 numero, 1 carattere speciale",
    ),
];
