const express = require("express");

const fileController = require("../controllers/files");
const filerouter = express.Router();

filerouter.get("/:id", fileController.getfile)
filerouter.get("/download/:id", fileController.downloadFile)
filerouter.post("/upload", fileController.uploadFile)
filerouter.delete("/:id", fileController.deleteFile)

filerouter.delete("/", fileController.deleteAll)

module.exports = filerouter;
