const jwt = require("jsonwebtoken");
const { generalHandleWithoutTransaction } = require("../controllers/static");

const authentication = async (req, res, next) => {
  generalHandleWithoutTransaction(
    async () => {
      const header = req.headers["authorization"];
      if (typeof header !== "undefined") {
        const bearer = header.split(" ");
        const token = bearer[1];
        const tokenPayload = await jwt.verify(token, process.env.JWT_KEY);
        req.body.username = tokenPayload.name;
        req.body.userRole = tokenPayload.role;
        next();
      } else {
        res.status(403).json({ msg: "Invalid token. Please login again." });
      }
    },
    res,
    "Failed to verify your token. Server error."
  );
};

module.exports = authentication;
