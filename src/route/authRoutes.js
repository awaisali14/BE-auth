const express = require("express");
const router = express.Router();
const {
  register,
  login,
  authenticate,
  getUser,
} = require("../controller/authControllers");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/login").get(authenticate, getUser);

module.exports = router;
