const express = require("express");

const fileController = require("../controllers/files.controller");

const filerouter = express.Router();

filerouter.post("/upload", fileController.uploadFile);
filerouter.get("/files", fileController.retrieveFiles);
filerouter.get("/files/:tag", fileController.searchFilesByTag);
filerouter.get("/download/:filename", fileController.downloadFile);

module.exports = filerouter;
