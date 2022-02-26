const mongoose = require("mongoose");

const connection = require("../database");

const emailValidater = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: "Email address is required.",
      trim: true,
      lowercase: true,
      unique: [true, "User is already exist."],
      validate: [emailValidater, "Please fill a valid email address"],
    },
    name: { type: String, required: true },
    password: {
      type: String,
      required: "Name is required.",
      minlength: [9, "Password must be at least 9 characters."],
    },
  },
  { timestamps: true }
);

const UserModel = connection.model("user", userSchema);

module.exports = UserModel;
