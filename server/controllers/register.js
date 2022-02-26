const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const UserModel = require("../models/user");
const registerValidationSchema = require("../models/registerValidation");

const register = async (req, res) => {
  // Validate input
  const { error } = Joi.object(registerValidationSchema).validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorObject = {};
    const errorList = error.details;
    errorList.forEach((error) => {
      errorObject[error.path] = error.message;
    });
    return res.status(400).json({ errorObject });
  }

  // Check duplication of email address in database
  try {
    const result = await UserModel.findOne({ email: req.body.email });
    if (result !== null) {
      return res.status(400).json({ msg: "User exists, please login." });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Failed to check duplication." });
  }

  // Save register data to database
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    await UserModel.create(req.body);
    return res
      .status(200)
      .json({ msg: "Your account has been registered successfully." });
  } catch (error) {
    console.log(error.properties);
    return res
      .status(400)
      .json({ msg: "Failed to register user to database." });
  }
};

module.exports = register;
