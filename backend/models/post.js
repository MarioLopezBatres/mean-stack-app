const mongoose = require("mongoose");

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
  },
  // ref - allows to define to which model this id will belong
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

// must start by capital
module.exports = mongoose.model("Post", postSchema);
