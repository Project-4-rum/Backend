const express = require("express");
// const path = require("path");

const filerouter = require("./routes/files.router");
const app = express();

app.use(express.json());
app.use(filerouter);

module.exports = app;
