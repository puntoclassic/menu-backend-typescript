import { createTransport } from "nodemailer";
import { nodemailerMjmlPlugin } from "nodemailer-mjml";

var transport: any = null;

const initService = () => {
  const { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USERNAME, MAIL_PASSWORD } =
    process.env;
  transport = createTransport({
    host: MAIL_HOST as string,
    port: parseInt(MAIL_PORT!),
    secure: MAIL_SECURE == "True",
    requireTLS: true,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  });

  transport.use(
    "compile",
    nodemailerMjmlPlugin({
      templateFolder: "views/emails",
      minifyHtmlOutput: true,
    }),
  );
};

const sendActivateAccountCode = async (email: string, link: string) => {
  await transport.sendMail({
    subject: process.env.MAIL_FROM_NAME + " - " + "Attiva il tuo account",
    to: email,
    templateData: {
      link: link,
    },
    templateName: "web/accountActivationCode",
  });
};

const sendActivateApiAccountCode = async (email: string, code: string) => {
  await transport.sendMail({
    subject: process.env.MAIL_FROM_NAME + " - " + "Attiva il tuo account",
    to: email,
    templateData: {
      code: code,
    },
    templateName: "api/accountActivationCode",
  });
};

const sendResetPasswordApi = async (email: string, password: string) => {
  await transport.sendMail({
    subject: process.env.MAIL_FROM_NAME + " - " + "Reset della password",
    to: email,
    templateData: {
      code: password,
    },
    templateName: "api/accountResetPassword",
  });
};

const sendResetPassword = async (email: string, link: string) => {
  await transport.sendMail({
    subject: process.env.MAIL_FROM_NAME + " - " + "Reset della password",
    to: email,
    templateData: {
      link: link,
    },
    templateName: "web/accountResetPassword",
  });
};

export default {
  initService,
  sendActivateAccountCode,
  sendActivateApiAccountCode,
  sendResetPasswordApi,
  sendResetPassword,
};
