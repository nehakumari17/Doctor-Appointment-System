const JWT = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(401).send({
        message: "Authorization header is missing",
        success: false,
      });
    }
    
    const token = req.headers["authorization"].split(" ")[1];

    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: "Authentication failed",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = authMiddleware;
