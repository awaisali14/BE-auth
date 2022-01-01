const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const AuthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide your password confirm"],
    validate: {
      // function is called whenever new document is created
      // only works on create and save, not on findone and update
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same.",
    },
  },
});

AuthSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const AuthModel = mongoose.model("AuthModel", AuthSchema);
module.exports = AuthModel;
