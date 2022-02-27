const Joi = require("@hapi/joi");

const registerValidationSchema = {
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(9),
  registerCode: Joi.string().required(),
};

const loginValidationSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

// Validate  input
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = Joi.object(schema).validate(req.body, {
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
    next();
  };
};

const loginValidation = validateInput(loginValidationSchema);
const registerValidation = validateInput(registerValidationSchema);

module.exports = { loginValidation, registerValidation };
