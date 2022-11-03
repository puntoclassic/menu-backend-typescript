import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import mailService from "./services/mailService";

const fileUpload = require("express-fileupload");

var cookieParser = require("cookie-parser");
var cors = require("cors");
var session = require("express-session");
export const accessTokenSecret = "youraccesstokensecret";
export const jwtOptions = {
  expiresIn: "30 days",
};
const app: Express = express();
var cors = require("cors");

//cors
app.use(cors({
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:4200",
    "http://localhost",
  ],
}));

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
}));

//body parser
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

//cookie per csrf
app.use(cookieParser());

//static contents
app.use(express.static("public"));
app.use("/public", express.static("public"));

//sessions
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  }),
);

//emails
mailService.initService();

export const rootPath = __dirname;

//routes
app.use("/", require("./routes/homeRoutes"));
app.use("/api", require("./routes/api/rootRoutes"));

//404 page
app.use((req: Request, res: Response, next: any) => {
  res.status(404).end("Pagina non trovata");
});

app.listen(4000, () => {
  console.log("App started");
});
