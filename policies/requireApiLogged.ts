import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { accessTokenSecret } from "../app";
const jwt = require("jsonwebtoken");

export default async (req: Request, res: Response, next: Function) => {
  var token = req.headers.authorization?.split(" ")[1] || req.cookies["token"];
  if (token) {
    jwt.verify(token, accessTokenSecret, (err: any, decoded: any) => {
      if (!err) {
        req.session.user = decoded;
        next();
      } else {
        if (err instanceof TokenExpiredError) {
          res.status(403).json({
            "status": "Session expired",
          });
        } else {
          res.status(403).json({
            "status": "Login required",
          });
        }
      }
    });
  } else {
    res.status(403).json({
      "status": "Login required",
    });
  }
};
