const mongoose = require('mongoose');

// id is automatically generated my mongoose
// title could be a String
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  }
});

// must start by capital
module.exports = mongoose.model('Post', postSchema);
