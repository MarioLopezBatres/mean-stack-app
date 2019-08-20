const express = require('express');

// Middleware
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const PostController = require("../controllers/posts");

const router = express.Router();

// This route is protected by middleware check-auth
// /api/posts has been added by app.js
// URLs must be different than the ones created in the router of Angular
router.post("", checkAuth, extractFile, PostController.createPost);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);


router.get('', PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
