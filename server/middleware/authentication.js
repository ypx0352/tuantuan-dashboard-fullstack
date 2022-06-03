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
        const { name, role } = tokenPayload;
        req.body.username = name;
        req.body.userRole = role;

        //Generate and add a new token to responst header
        const nextToken = jwt.sign({ name, role }, process.env.JWT_KEY, {
          expiresIn: "1h", // 1 hour
        });
        res.setHeader('token',nextToken);
        res.setHeader("Access-Control-Expose-Headers", 'token')

        next();
      } else {
        res.status(403).json({ msg: "Token missing. Please login again." });
      }
    },
    res,
    "Token expires. Please login again."
  );
};

module.exports = authentication;
