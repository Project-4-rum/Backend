const express = require("express");
const router = express.Router();
const multer = require("multer");
const File = require("../models/file");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter,
});

// Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { filename, tags } = req.body;
    const file = new File({ filename, tags });
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all files
router.get("/files", async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
