const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const authenticate = require("../middleware/authMiddleware");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/original");
const thumbDir = path.join(__dirname, "../uploads/thumbs");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    cb(null, allowed.includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/issues", authenticate, upload.single("photo"), async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    if (!title || !description || !latitude || !longitude || !req.file) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const originalPath = `/uploads/original/${req.file.filename}`;
    const thumbFilename = `thumb_${req.file.filename}`;
    const thumbPath = `/uploads/thumbs/${thumbFilename}`;

    await sharp(req.file.path)
      .resize(200)
      .toFile(path.join(thumbDir, thumbFilename));

    const id = await Issue.create({
      title,
      description,
      photo: originalPath,
      thumbnail: thumbPath,
      latitude,
      longitude,
      user_id: req.user.id,
    });

    req.io.emit("issue:new", { id, title, latitude, longitude, thumbnail: thumbPath });

    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/issues", async (req, res) => {
  try {
    const issues = await Issue.getAll(req.query);
    if (!issues.length) return res.status(204).send();
    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/issues/:id", async (req, res) => {
  try {
    const issue = await Issue.getById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Not found" });
    res.status(200).json(issue);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;