import { body } from "express-validator";

export default [
  body("item_id")
    .notEmpty(),
  body("item_price")
    .notEmpty(),
  body("item_name")
    .notEmpty(),
];
