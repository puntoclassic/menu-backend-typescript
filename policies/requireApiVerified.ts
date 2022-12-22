import { Request, Response } from "express";
import { accessTokenSecret } from "../app";
const jwt = require("jsonwebtoken");

export default async (req: Request, res: Response, next: Function) => {
  var token = req.headers.authorization?.split(" ")[1] || req.cookies["token"];

  if (token) {
    jwt.verify(token, accessTokenSecret, (err: any, decoded: any) => {
      if (!err) {
        if (!req.session.user.verified) {
          res.status(403).json({
            "status": "Account not actived",
          });
        } else {
          next();
        }
      }
    });
  } else {
    next();
  }
};
