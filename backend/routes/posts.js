const express = require('express');
const Post = require('../models/post');
// Handle image upload
const multer = require('multer');

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

// /api/posts has been added by app.js
// URLs must be different than the ones created in the router of Angular
router.post("", multer({
  storage: storage
}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  // Store in database. The name of the collection is always the plural of your model, in this case, posts
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  });
});

router.put("/:id", multer({
  storage: storage
}).single("image"), (req, res, next) => {
  // Get no file
  let imagePath = req.body.imagePath;
  // Get new file
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({
    _id: req.params.id
  }, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Update successful!"
    });
  });
});


router.get('', (req, res, next) => {
  // Pagination
  // pagesize and page are your election. Can be randomly changed
  // add + to convert to number (string by default )
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  // postQuery is not executed until .then()
  const postQuery = Post.find();
  let fetchedPosts;
  // For long list is not efficient
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: "Posts fetches successfully",
      posts: fetchedPosts,
      maxPosts: count
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({
        message: 'Post not found!'
      });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted!"
    });
  });
});

module.exports = router;
