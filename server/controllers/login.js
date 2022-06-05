const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  typeToModel,
  generalHandleWithoutTransaction,
  writeLog,
} = require("./static");

const login = async (req, res) => {
  generalHandleWithoutTransaction(
    async () => {
      const { email, password } = req.body;

      // Confirm this account exists and fetch username and hashed password.
      const resultInUser = await typeToModel("user").findOne({
        email: email,
      });
      if (resultInUser === null) {
        return res
          .status(400)
          .json({ msg: "User does not exist, please register first." });
      }

      const hashedPassword = resultInUser.password;
      const name = resultInUser.name;
      const role = resultInUser.role;

      // Verify password
      const result = await bcrypt.compare(password, hashedPassword);
      if (!result) {
        return res.status(400).json({ msg: "Wrong password." });
      }

      // Write the log
      await writeLog(name, "Login", "", null);

      // Return token to front-end
      const token = jwt.sign({ name, role }, process.env.JWT_KEY, {
        expiresIn: '1h', // 1 hour
      });
      return res
        .status(200)
        .json({ msg: "Login successfully.", token, name, role });
    },
    res,
    "Failed to login. Server error."
  );
};

module.exports = login;
