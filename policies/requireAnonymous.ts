import { Request, Response } from "express";

export default async (req: Request, res: Response, next: Function) => {
  if (!req.session.token && !req.session.user) {
    next();
  } else {
    res.redirect("/account");
  }
};
