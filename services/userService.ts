import dataSource from "./dataSource";
import mailService from "./mailService";
import { Request } from "express";
import { Prisma } from "@prisma/client";
const bcrypt = require("bcrypt");
var generator = require("generate-password");

const checkEmailExists = async (email: string): Promise<boolean> => {
  var countEmail = await dataSource.user.count({
    where: {
      email: email,
    },
  });

  return countEmail > 0;
};

const createUser = async (
  data: Prisma.userCreateInput,
) => {
  data.passwordHash = bcrypt.hashSync(data.passwordHash, 10);

  var user = await dataSource.user.create({
    data: data,
  });

  if (user) {
    return user;
  } else {
    return false;
  }
};

const sendActivationEmailSPA = async (
  email: string,
  url: string,
): Promise<boolean> => {
  var user = await dataSource.user.findFirst({
    where: {
      email: email,
      activationToken: {
        not: null,
      },
    },
  });

  if (user) {
    var link = url + "?token=" + user?.activationToken;
    await mailService.sendActivateAccountCode(user.email, link);
    return true;
  } else {
    return false;
  }
};

const sendActivationEmailApi = async (email: string): Promise<boolean> => {
  var user = await dataSource.user.findFirst({
    where: {
      email: email,
      activationToken: {
        not: null,
      },
    },
  });

  if (user) {
    await mailService.sendActivateApiAccountCode(email, user.activationToken!);
    return true;
  } else {
    return false;
  }
};

const validateLogin = async (
  email: string,
  password: string,
): Promise<boolean> => {
  var user = await dataSource.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user) {
    return bcrypt.compareSync(password, user.passwordHash);
  } else {
    return false;
  }
};

const getById = async (id: number) => {
  return await dataSource.user.findFirst({
    select: {
      firstname: true,
      lastname: true,
      role: true,
      verified: true,
    },
    where: {
      id: id,
    },
  });
};

const getByEmail = async (email: string) => {
  return await dataSource.user.findFirst({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      role: true,
      verified: true,
      email: true,
    },
    where: {
      email: email,
    },
  });
};

const getByActivationToken = async (email: string) => {
  return await dataSource.user.findFirst({
    select: {
      activationToken: true,
    },
    where: {
      email: email,
    },
  });
};

const verifyToken = async (token: string): Promise<boolean> => {
  return await dataSource.user.count({
    where: {
      activationToken: token,
    },
  }) > 0;
};

const activateAccount = async (token: string) => {
  return await dataSource.user.updateMany({
    where: {
      activationToken: token,
    },
    data: {
      verified: true,
      activationToken: null,
    },
  });
};

const updatePersonalInfo = async (
  firstname: string,
  lastname: string,
  userId: number,
) => {
  await dataSource.user.update({
    data: {
      firstname: firstname,
      lastname: lastname,
    },
    where: {
      id: userId,
    },
  });
};

const updatePassword = async (
  currentPassword: string,
  newPassword: string,
  userEmail: string,
) => {
  if (await validateLogin(userEmail, currentPassword)) {
    await dataSource.user.update({
      data: {
        passwordHash: bcrypt.hashSync(newPassword, 10),
      },
      where: {
        email: userEmail,
      },
    });
    return true;
  } else {
    return false;
  }
};

const resetPasswordApi = async (email: string) => {
  var password = generator.generate({
    length: 8,
    numbers: true,
    symbols: "@",
    uppercase: true,
    strict: true,
  });

  await dataSource.user.update({
    data: {
      passwordHash: bcrypt.hashSync(password, 10),
    },
    where: {
      email: email,
    },
  });

  await mailService.sendResetPasswordApi(email, password);
};

const resetPassword = async (email: string, url: string) => {
  var randomstring = require("randomstring");

  const token = randomstring.generate(24);

  try {
    await dataSource.user.update({
      data: {
        resetToken: token,
      },
      where: {
        email: email,
      },
    });

    var link = url + "?token=" + token;

    await mailService.sendResetPassword(email, link);
  } catch {
  }
};

const updatePasswordByToken = async (token: string, password: string) => {
  var result = await dataSource.user.updateMany({
    data: {
      passwordHash: bcrypt.hashSync(password, 10),
    },
    where: {
      resetToken: token,
    },
  });

  await dataSource.user.updateMany({
    data: {
      resetToken: null,
    },
    where: {
      resetToken: token,
    },
  });

  return result.count > 0;
};

export default {
  createUser,
  checkEmailExists,
  validateLogin,
  getById,
  getByEmail,
  getByActivationToken,
  verifyToken,
  activateAccount,
  sendActivationEmailApi,
  updatePersonalInfo,
  updatePassword,
  updatePasswordByToken,
  sendActivationEmailSPA,
  resetPassword,
  resetPasswordApi,
};
