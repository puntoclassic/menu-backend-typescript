import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { accessTokenSecret, jwtOptions } from "../../app";
import userService from "../../services/userService";
import loginValidator from "../../validators/loginValidator";
import signinValidator from "../../validators/signinValidator";
import requireApiLogged from "../../policies/requireApiLogged";
import requireApiVerified from "../../policies/requireApiVerified";
import updatePersonalInfoValidator from "../../validators/updatePersonalInfoValidator";
import resetPasswordTokenValidator from "../../validators/resetPasswordTokenValidator";

const jwt = require("jsonwebtoken");

var router = express.Router();
var cache = require("memory-cache");

router.get(
  "/status",
  requireApiLogged,
  async (req: Request, res: Response) => {
    var user: any = req.session.user!;

    var cached = cache.get("" + user.id);

    if (cached) {
      res.status(200).json(cached);
    } else {
      var response = await userService.getByEmail(user.email);
      cache.put(user.id, response, 30 * 1000);
      res.status(200).json(response);
    }
  },
);

router.get(
  "/orders",
  requireApiLogged,
  requireApiVerified,
  (req: Request, res: Response) => {
    var user: any = req.session.user!;
    res.status(200).json([]);
  },
);

router.get(
  "/logout",
  async (req: Request, res: Response) => {
    res.clearCookie("token");

    res.status(200).json({
      "status": "Success",
    });
  },
);

router.get(
  "/cookie",
  async (req: Request, res: Response) => {
    res.status(200).json(req.cookies["token"]);
  },
);

router.get(
  "/session",
  requireApiLogged,
  async (req: Request, res: Response) => {
    res.status(200).json(req.session.user);
  },
);

router.post("/login", loginValidator, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(200).json(errors.mapped());
  } else {
    if (await userService.validateLogin(req.body.email, req.body.password)) {
      var user: any = await userService.getByEmail(req.body.email);

      var token = jwt.sign(
        user,
        accessTokenSecret,
        jwtOptions,
      );

      res.cookie("token", token);

      res.status(200).json(
        {
          "status": "Login success",
          "token": token,
        },
      );
    } else {
      res.status(403).json(
        {
          "status": "Login failed",
        },
      );
    }
  }
});

router.post(
  "/validateLogin",
  loginValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(500).json(errors.mapped());
    } else {
      if (await userService.validateLogin(req.body.email, req.body.password)) {
        res.status(200).json(
          {
            "status": "Login success",
          },
        );
      } else {
        res.status(403).json(
          {
            "status": "Login failed",
          },
        );
      }
    }
  },
);

router.post("/signin", signinValidator, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(500).json({
      "status": "Error",
      "fields": errors.mapped(),
    });
  } else {
    var { email, firstname, lastname, password, source } = req.body;

    var user = await userService.createUser({
      email: email as string,
      firstname: firstname as string,
      lastname: lastname as string,
      passwordHash: password as string,
    });

    if (
      user
    ) {
      if (source === "web") {
        await userService.sendActivationEmailSPA(
          user.email,
          process.env.FRONTEND_VERIFY_ACCOUNT_URL as string,
        );
      } else {
        await userService.sendActivationEmailApi(user.email);
      }

      res.status(200).json({
        "status": "success",
      });
    } else {
      res.status(500).json({
        "status": "failed",
      });
    }
  }
});

router.post("/activateAccount", async (req: Request, res: Response) => {
  var token = req.body.token as string;
  if (token) {
    if (await userService.verifyToken(token)) {
      await userService.activateAccount(token);

      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(500).json({
        status: "failed",
      });
    }
  } else {
    res.status(500).json({
      status: "failed",
    });
  }
});

router.post("/resend-activation-email", async (req: Request, res: Response) => {
  const { email, source } = req.body;
  if (email) {
    if (source === "web") {
      await userService.sendActivationEmailSPA(
        email,
        process.env.FRONTEND_VERIFY_ACCOUNT_URL as string,
      );
    } else {
      await userService.sendActivationEmailApi(email);
    }
    res.status(200).json({
      status: "Richiesta seguita",
    });
  } else {
    res.status(500).json({
      status: "Richiesta fallita",
    });
  }
});

/*

Enable csrf for SPA

router.use(csurf({ cookie: false }));

router.get("/csrf", (req: Request, res: Response) => {
  res.send(req.csrfToken());
});

*/

router.post(
  "/emailIsBusy",
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (email) {
      if (await userService.checkEmailExists(email)) {
        res.status(200).json({
          "status": "Email busy",
        });
      } else {
        res.status(200).json({
          "status": "Email free",
        });
      }
    } else {
      res.status(200).json({
        "status": "Bad request",
      });
    }
  },
);

router.post(
  "/updatePersonalInfo",
  requireApiLogged,
  updatePersonalInfoValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(200).json({
        "status": "Error",
        "fields": errors.mapped(),
      });
    } else {
      const { firstname, lastname } = req.body;

      await userService.updatePersonalInfo(
        firstname,
        lastname,
        req.session.user.id,
      );

      res.status(200).json({
        "status": "success",
      });
    }
  },
);

router.post(
  "/updatePassword",
  requireApiLogged,
  async (req: Request, res: Response) => {
    const { password, currentPassword } = req.body;

    if (password && currentPassword) {
      var result = await userService.updatePassword(
        currentPassword,
        password,
        req.session.user.email,
      );

      if (result == true) {
        res.status(200).json({
          "status": "success",
        });
      } else {
        res.status(403).json({
          "status": "failed",
        });
      }
    } else {
      res.status(500).json({
        "status": "error",
        "message": "Password field missing",
      });
    }
  },
);

router.post(
  "/resetPassword",
  async (req: Request, res: Response) => {
    const { email, source } = req.body;

    if (email) {
      if (source === "web") {
        await userService.resetPassword(
          email,
          process.env.FRONTEND_PASSWORD_RESET_URL as string,
        );
      } else {
        await userService.resetPasswordApi(
          email,
        );
      }

      res.status(200).json({
        "status": "success",
      });
    } else {
      res.status(500).json({
        "status": "error",
        "message": "Email field missing",
      });
    }
  },
);

router.post(
  "/updatePasswordByToken",
  resetPasswordTokenValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(500).json({
        "status": "error",
        "fields": errors.mapped(),
      });
    } else {
      const { token, password } = req.body;

      //result returns true if the number of fields updates is greater than zero
      var result = await userService.updatePasswordByToken(token, password);

      if (result) {
        res.status(200).json({
          "status": "success",
        });
      } else {
        res.status(500).json({
          "status": "error",
        });
      }
    }
  },
);

module.exports = router;
