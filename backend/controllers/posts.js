const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    // Part of the token in user.js. checkAuth is run here so we can get the data that was added (req.userData)
    // Adds the id of the user who created the ID
    creator: req.userData.userId
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
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed"
      })
    });
};

exports.updatePost = (req, res, next) => {
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
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({
      _id: req.params.id,
      // Only the creator can edit it
      creator: req.userData.userId
    }, post).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Update successful!"
        });
      }
      // Errors with the post. Do not find the post
      else {
        res.status(401).json({
          message: "Not authorized to edit the post!"
        });
      }
    })
    // Error with server. Technical errors
    .catch(error => {
      res.status(500).json({
        message: "Could not update post"
      })
    });
};

exports.getPosts = (req, res, next) => {
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
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed"
      })
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        // Post was not found
        res.status(404).json({
          message: 'Post not found!'
        });
      }
    })
    // Technical errors
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed"
      })
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    }).then(result => {
      console.log(result);
      // Delete result does not have nModified attribute so it must use n
      if (result.n > 0) {
        res.status(200).json({
          message: "Post deleted!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized to delete the post!"
        });
      }
    })
    // Technical error handler
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed"
      })
    });
};
