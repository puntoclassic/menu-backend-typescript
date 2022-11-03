import { Request, Response } from "express";

export default (role: string) => {
  return (req: Request, res: Response, next: Function) => {
    if (req.session.user) {
      if (req.session.user.role == role) {
        next();
      } else {
        res.json({
          "status": "Forbidden",
        }).status(403);
      }
    } else {
      next();
    }
  };
};
