import { Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { accessTokenSecret } from "../app";
const jwt = require("jsonwebtoken");

export default async (req: Request, res: Response, next: Function) => {
  var token = req.session.token;

  jwt.verify(
    token,
    accessTokenSecret,
    async (err: JsonWebTokenError) => {
      if (!err) {
        next();
      } else {
        delete req.session.token;
        delete req.session.user;

        if (err instanceof TokenExpiredError) {
          await req.flash("info", "Sessione scaduta");
        } else {
          await req.flash("info", "Questa pagina richiede l'accesso");
        }
        res.redirect("/account/login?backUrl=" + req.originalUrl);
      }
    },
  );
};
