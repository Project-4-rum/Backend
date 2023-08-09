const { File, getFilesByTag } = require("../models/files.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/files"));
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

const fileController = {
  uploadFile: (req, res) => {
    //
    upload.single("file")(req, res, function (err) {
      console.log(req.file);
      if (err) {
        return res.status(400).json({ error: `Error uploading file ${err}` });
      }
      // console

      const { filename, tags } = req.body;
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      const newFile = new File(filename, req.file.size, tagsArray);

      res.status(201).json({ message: "File Uploaded Successfully" });
    });
  },
  retrieveFiles: (req, res) => {
    //
  },
  searchFilesByTag: (req, res) => {
    //
    const { tags } = req.query;
    if (!tags) {
      return res.status(400).json({ error: "Tags parameter is required" });
    }

    const tagsArray = tags.split(",").map((tags) => tags.trim());
    getFilesByTag(tagsArray, (files) => {
      if (files) {
        res.status(200).json(files);
      } else {
        res.status(500).json({ error: "Error retrieving Files Data" });
      }
    });
  },
  downloadFile: (req, res) => {
    //
    const filename = req.params.filename;
    const filepath = path.join(__dirname, "../storage/files/", filename);

    if (fs.existsSync(filepath)) {
      res.download(filepath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  },
};

module.exports = fileController;
