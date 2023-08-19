const express = require("express");

const fileController = require("../controllers/files.controller");

const filerouter = express.Router();

filerouter.post("/upload", fileController.uploadFile);
filerouter.get("/files/:id", fileController.getfile);
filerouter.get("/download/:id", fileController.downloadFile);

module.exports = filerouter;
