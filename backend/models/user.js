const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")
// id is automatically generated my mongoose
// title could be a String
const userSchema = mongoose.Schema({
  // Unique does not automaticaly thrown an error. Require does
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// npm install mongoose-unique-validators --save handles the validatio
userSchema.plugin(uniqueValidator);

// must start by capital
module.exports = mongoose.model('User', userSchema);
