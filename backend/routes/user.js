const express = require('express');
const UserController = require("../controllers/user");
const router = express.Router();

// Routes for signup and login should not be protected. Any user should be able to reach them
router.post("/signup", UserController.createUser);
router.post("/login", UserController.userLogin);

module.exports = router;
