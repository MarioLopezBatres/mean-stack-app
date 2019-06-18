// Imports
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();


//Change "test" in connect for any name for your database. In this case, node-angular
mongoose.connect("mongodb+srv://mariolopez:M0scqhqVsdEpLu5B@cluster0-ht50h.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed! ');
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
//Image folder staticly accessable. backend/images is the name of the folders
app.use("/images", express.static(path.join("backend/images")));

// Add headers for CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

// Set the begining of the URL
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

// Export
module.exports = app;
