const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs/promises");
const moment = require("moment");
require("dotenv").config();

const authRouter = require("./routes/api/auth")
const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"))

app.use("/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.use(async (req, res, next) => {
  const { method, url } = req;
  const date = moment().format("DD-MM-YYYY_hh:mm:ss");
  await fs.appendFile(
    "./models/public/server.log",
    `\n${method} ${url} ${date}`
  );
  next();
});

module.exports = app;
