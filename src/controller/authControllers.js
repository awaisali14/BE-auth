const AuthModel = require("../model/authModel");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    let token;
    console.log(req.body);
    //create new user
    const newUser = new AuthModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    //save user and respond
    const user = await newUser.save();
    if (req.body.saveInfo) {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {});
    } else {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
    }

    res.status(200).json({
      userId: user._id,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const login = async (req, res) => {
  try {
    let token;
    const user = await AuthModel.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    if (req.body.saveInfo) {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {});
    } else {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
    }

    res.status(200).json({
      userId: user._id,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await AuthModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const authenticate = async (req, res, next) => {
  try {
    let token;
    const { authorization } = req.headers;
    if (authorization) {
      token = authorization.split(" ")[1];

      console.log(token);
    }
    if (!token) {
      return res.status(404).json({
        status: "Error",
        message: "Token is not availabe",
      });
    }
    // token verfication
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.user = { id: decode.id };
    next();
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: "Authentication Failed",
    });
  }
};

module.exports = {
  register,
  login,
  authenticate,
  getUser,
};
