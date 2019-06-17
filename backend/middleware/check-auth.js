const jwt = require("jsonwebtoken");

// Control access on the backend and deny it for any request which has no valid token. It protects some of the routes defined in the code
module.exports = (req, res, next) => {
  // Convention is to use Bearer asdfasdfa. Splits after whitespace to get the second half
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_this_should_be_longer");
    next();
  } catch (error) {
    // 401 = Not authenticated
    res.status(401).json({
      message: "Auth failed"
    });
  }
}
