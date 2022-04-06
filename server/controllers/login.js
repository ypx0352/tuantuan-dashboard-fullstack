const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user");

const login = async (req, res) => {
  // Confirm this account exists
  let hashedPassword = "";
  let name = "";
  let uid = "";
  try {
    const result = await UserModel.findOne({ email: req.body.email });
    if (result === null) {
      return res
        .status(400)
        .json({ msg: "User does not exist, please register first." });
    }

    hashedPassword = result.password;
    name = result.name;
    uid = result._id;
    admin = result.admin;
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ msg: "Failed to check user registration status." });
  }

  // Verify password
  try {
    const result = await bcrypt.compare(req.body.password, hashedPassword);
    if (!result) {
      return res.status(400).json({ msg: "Wrong password." });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Failed to verify your password." });
  }

  // Return token to front-end
  try {
    const token = jwt.sign({ uid }, process.env.JWT_KEY, {
      expiresIn: 60, // 1 minute
    });
    return res
      .status(200)
      .json({ msg: "Login successfully.", token, name, admin });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Failed to get token." });
  }
};

module.exports = login;
