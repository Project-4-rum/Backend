const multer = require("multer");
const path = require("path");
const fs = require("fs");

const FileModel = require("../models/files.model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/files"));
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

const fileController = {
  uploadFile: async (req, res) => {
    try {
      upload.single("file")(req, res, async function (err) {
        if (err) {
          return res.status(400).json({ error: `Error uploading file ${err}` });
        }

        const filename = req.body.filename;
        const uniquename = req.file.filename;
        const size = req.file.size;
        const uploadedby = req.body.uploadedby;

        const newFile = new FileModel({
          uniquename: uniquename,
          filename: filename,
          size: size,
          uploadedby: uploadedby,
        });

        try {
          const savedFile = await newFile.save();
          res.status(201).json({ id: savedFile._id });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getfile: async (req, res) => {
    try {
      const file = await FileModel.findById(req.params.id);
      if (!file) return res.status(404).json({ message: "FILE NOT FOUND" });

      res.json(file);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  downloadFile: async (req, res) => {
    try {
      const file = await FileModel.findById(req.params.id);
      if (!file) return res.status(404).json({ message: "FILE NOT FOUND" });

      const filepath = path.join(
        __dirname,
        "../storage/files/",
        file.uniquename
      );

      if (fs.existsSync(filepath)) {
        res.download(filepath);
      } else {
        res.status(404).json({ error: "File not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = fileController;
