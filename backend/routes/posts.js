const express = require('express');
// Handle image upload
const multer = require('multer');
// Middleware
const checkAuth = require("../middleware/check-auth");
const PostController = require("../controllers/posts");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) error = null;
    // In the project, not database
    callback(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

// This route is protected by middleware check-auth
// /api/posts has been added by app.js
// URLs must be different than the ones created in the router of Angular
router.post("", checkAuth, multer({
  storage: storage
}).single("image"), PostController.createPost);

router.put("/:id", checkAuth, multer({
  storage: storage
}).single("image"), PostController.updatePost);


router.get('', PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
